import React, {
  FunctionComponent,
  useEffect,
  useRef,
  useState,
  RefObject,
} from "react";
import * as d3 from "d3";
import dayjs from "dayjs";

import { DiagramBaseProps } from "../types";
import { getAxisLeftLegendOffset, getMargins, Size } from "../../util/util";
import { useWindowSize } from "../../util/util";
import { Maximize } from "../../assets/maximize";
import { addMarkers } from "./components/marker";
import { getAxisGridColor, getColors } from "./components/util";

export const D3BarDiagram: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  const svgRef: RefObject<SVGSVGElement> = useRef(null);
  const tooltipRef: RefObject<HTMLDivElement> = useRef(null);
  const size: Size = useWindowSize();
  const [tooltip, setTooltip] = useState<{ x: number; y: number; end: number }>(
    {
      x: 0,
      y: 0,
      end: 0,
    }
  );

  // @todo This adds one MutationObserver per LineDiagram. Add this to one
  //    general component which shares the state.
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Color handling.
  const axisGridColor = getAxisGridColor(darkMode);
  const colors = getColors(darkMode, props.nivoProps, props.color);

  // Combine all data into one array and sort by x value.
  let combinedData: any[] = [];
  if (props.data.length > 1) {
    for (const serie of props.data) {
      combinedData = [...combinedData, ...serie.data];
    }
  } else {
    combinedData = props.data[0].data;
  }
  combinedData.sort((a, b) => {
    return a.x - b.x;
  });

  // @see https://github.com/d3/d3-time-format
  let dateTimeFormat = d3.timeFormat("%H:%M");
  switch (props.context) {
    case "week":
      dateTimeFormat = d3.timeFormat("%d.%m");
      break;
    case "month":
      dateTimeFormat = d3.timeFormat("%d.%m");
      break;
    case "year":
    case "alltime":
      dateTimeFormat = d3.timeFormat("%d.%m");
      break;
  }

  const callback = (mutationsList: Array<MutationRecord>) => {
    mutationsList.forEach((mutation) => {
      if (
        mutation.attributeName === "class" &&
        (mutation.target as HTMLElement).classList.contains("dark")
      ) {
        setDarkMode(true);
      } else {
        setDarkMode(false);
      }
    });
  };

  useEffect(() => {
    const mutationObserver = new MutationObserver(callback);
    mutationObserver.observe(document.documentElement, { attributes: true });
    return () => {
      mutationObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    // Clean up (otherwise on resize it gets rendered multiple times).
    d3.select(svgRef.current).selectChildren().remove();

    // Determine the number of unique units to display.
    const unitCombinedDistinct: string[] = Array.isArray(props.unit)
      ? [...new Set(props.unit)]
      : [props.unit];

    // @see https://gist.github.com/mbostock/3019563
    const margin = {
        top: 20,
        // Second axis on the right?
        right: unitCombinedDistinct.length > 1 ? 50 : 10,
        bottom: 40,
        left: getMargins(props.observation).left - 2.5,
      },
      width = svgRef.current?.parentElement
        ? svgRef.current?.parentElement.clientWidth - margin.left - margin.right
        : 0,
      height = svgRef.current?.parentElement
        ? svgRef.current?.parentElement.clientHeight -
          margin.top -
          margin.bottom
        : 0,
      xScale = d3
        .scaleBand()
        .range([0, width])
        .domain(combinedData.map((d: any) => d.x)),
      yScaleMin = props.nivoProps.yScaleMin
        ? parseFloat(props.nivoProps.yScaleMin)
        : d3.min(combinedData, (d: any) => d.y) -
          parseFloat(props.nivoProps.yScaleOffset),
      yScaleMax = props.nivoProps.yScaleMax
        ? parseFloat(props.nivoProps.yScaleMax)
        : d3.max(combinedData, (d: any) => d.y) +
          parseFloat(props.nivoProps.yScaleOffset),
      yScale = d3
        .scaleLinear()
        .domain([yScaleMin, yScaleMax])
        .range([height, 0]);

    const svgElement = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x Axis.
    svgElement
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(
        d3
          .axisBottom(xScale)
          .tickFormat((d) => dateTimeFormat(new Date(parseInt(d) * 1000)))
          .tickSize(0)
          .tickPadding(6)
      )
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    // y Axis.
    svgElement.append("g").call(
      d3
        .axisLeft(yScale)
        .ticks(5)
        .tickFormat((d) => {
          return d.toString();
        })
        .tickSize(0)
        .tickPadding(6)
    );

    // Y Axis Label.
    svgElement
      .append("g")
      .attr(
        "transform",
        `translate(${getAxisLeftLegendOffset(props.observation) + 2.25}, ${
          height / 2
        }), rotate(-90)`
      )
      .append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "0.75em")
      .style("dominant-baseline", "central")
      .style("font-family", "sans-serif")
      .text(props.unit[0]);

    // y Axis gutter.
    // @see https://stackoverflow.com/a/17871021
    svgElement
      .selectAll("line.horizontalGrid")
      .data(yScale.ticks())
      .enter()
      .append("line")
      .attr("class", "horizontalGrid")
      .attr("x1", 1)
      .attr("x2", width)
      .attr("y1", function (d) {
        return yScale(d);
      })
      .attr("y2", function (d) {
        return yScale(d);
      })
      .attr("fill", "none")
      .attr("shape-rendering", "crispEdges")
      .attr("stroke", axisGridColor)
      .attr("stroke-width", "1px");

    // Actual chart bars.
    props.data.forEach((dataSet: any, index: number) => {
      // @todo Outsource.
      const observationProps = props.nivoProps.obs
        ? {
            ...props.nivoProps,
            ...Object.entries(props.nivoProps.obs).filter(
              ([key, value]) => value.observation === props.observation[index]
            )[0][1],
          }
        : props.nivoProps;

      // Bars
      svgElement
        .selectAll("bars")
        .data(dataSet.data)
        .join("rect")
        .attr(
          "x",
          (d: any) => (xScale(d.x) as number) + xScale.bandwidth() * 0.125
        )
        .attr("y", (d: any) => yScale(d.y))
        .attr("width", xScale.bandwidth() * 0.75)
        .attr("height", (d: any) => height - yScale(d.y))
        .attr(
          "fill",
          darkMode && observationProps.color_dark
            ? observationProps.color_dark
            : colors[index]
        );

      if (props.nivoProps.enableLabel) {
        svgElement
          .selectAll(".text")
          .data(dataSet.data.filter((d: any) => d.y > 0))
          .enter()
          .append("text")
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .attr(
            "x",
            (d: any) => (xScale(d.x) as number) + xScale.bandwidth() / 2
          )
          .attr("y", (d: any) => yScale(d.y) + 5)
          .attr("dy", ".75em")
          .style("font-size", "0.75em")
          .text(function (d: any) {
            return d.y;
          });
      }
    });

    // Markers.
    if (props.nivoProps.markerValue) {
      addMarkers(
        svgElement,
        width,
        yScale,
        props.unit[0],
        props.nivoProps.markerValue,
        props.nivoProps.markerColor,
        props.nivoProps.markerLabel
      );
    }

    // Axis styling.
    svgElement
      .selectAll(".domain")
      .style("fill", "none")
      .style("stroke", axisGridColor)
      .style("stroke-width", "1");

    // Interactivity.
    if (props.nivoProps.isInteractive) {
      // @see  http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html
      const focus = svgElement.append("g").style("display", "none");

      if (props.nivoProps.enableCrosshair) {
        // Append the y line
        focus
          .append("line")
          .attr("class", "y")
          .style("stroke", darkMode ? "#FFF" : "#000")
          .style("stroke-dasharray", "7")
          .style("opacity", 0.75)
          .style("transition", "all 0.35s ease-in-out")
          .attr("x1", width)
          .attr("x2", width);
      }

      svgElement
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function () {
          focus.style("display", null);
        })
        .on("mouseout", function () {
          focus.style("display", "none");
          d3.select(tooltipRef.current).style("display", "none");
        })
        .on("mousemove", (event: MouseEvent) => {
          // @see https://stackoverflow.com/questions/38633082/d3-getting-invert-value-of-band-scales
          const xScaleStep = xScale.step();

          let i = Math.floor(d3.pointer(event)[0] / xScaleStep);

          if (i < 0) {
            i = 0;
          } else if (i > props.data[0].data.length - 1) {
            i = props.data[0].data.length - 1;
          }

          const d = props.data[0].data[i];

          setTooltip({ x: d.x, y: d.y, end: d.end });

          d3.select(tooltipRef.current)
            .style("display", "block")
            .style("left", xScaleStep * i + "px")
            // Tooltip over the bars.
            .style("top", yScale(d.y) - 45 + "px");

          if (props.nivoProps.enableCrosshair) {
            focus
              .select("line.y")
              .attr(
                "transform",
                "translate(" + width * -1 + "," + yScale(d.y) + ")"
              )
              .attr("x2", width + width);
          }
        });
    }
  }, [size, props.data, darkMode]);

  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      (
        svgRef.current?.closest(".diagram-tile") as HTMLDivElement
      ).requestFullscreen();
    }
  };

  return (
    <>
      <Maximize onClick={handleFullScreen} />
      <div style={{ height: "100%", position: "relative" }}>
        <svg ref={svgRef} />
        <div
          ref={tooltipRef}
          className="d3-diagram-tooltip"
          style={{
            display: "none",
            position: "absolute",
            zIndex: 1000,
            transition: "left 0.25s ease-in-out, top 0.35s ease-in-out",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              padding: "7px",
              color: "white",
              borderLeft: `5px solid ${colors[0]}`,
              textAlign: "right",
            }}
            className="diagram-tooltip"
          >
            <div style={{ marginBottom: "5px", whiteSpace: "nowrap" }}>
              {dateTimeFormat(new Date(tooltip.x * 1000))} -{" "}
              {dateTimeFormat(new Date(tooltip.end * 1000))}
            </div>
            <div>
              {tooltip.y} {props.unit[0]}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
