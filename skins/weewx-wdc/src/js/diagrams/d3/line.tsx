import React, {
  FunctionComponent,
  useEffect,
  useRef,
  useState,
  RefObject,
} from "react";
import * as d3 from "d3";
import dayjs from "dayjs";

import { Datum, DiagramBaseProps } from "../types";
import { getAxisLeftLegendOffset, getMargins, Size } from "../../util/util";
import { useWindowSize } from "../../util/util";
import { chartTransition } from "../..";
import { Tooltip } from "./components/tooltip";

export const D3LineDiagram: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  const svgRef: RefObject<SVGSVGElement> = useRef(null);
  const tooltipRef: RefObject<HTMLDivElement> = useRef(null);
  const size: Size = useWindowSize();
  const [tooltip, setTooltip] = useState<Datum[]>([] as Datum[]);

  // @todo This adds one MutationObserver per LineDiagram. Add this to one
  //    general component which shares the state.
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );
  const axisGridColor = darkMode ? "#525252" : "#dddddd";

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
        bottom: 20,
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
        .scaleTime()
        .range([0, width])
        .domain([
          new Date((combinedData[0].x as number) * 1000),
          new Date((combinedData[combinedData.length - 1].x as number) * 1000),
        ]),
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
      // @todo configurable tick date/time format.
      .call(d3.axisBottom(xScale).ticks(5, "%d.%m").tickSize(0).tickPadding(6));

    // x Axis gutter.
    // @see https://stackoverflow.com/a/17871021
    svgElement
      .selectAll("line.verticalGrid")
      .data(xScale.ticks())
      .enter()
      .append("line")
      .attr("class", "verticalGrid")
      .attr("y1", 0)
      .attr("y2", height)
      .attr("x1", function (d) {
        return xScale(d);
      })
      .attr("x2", function (d) {
        return xScale(d);
      })
      .attr("fill", "none")
      // @todo remove from here. Perhaps add to line.
      .attr("shape-rendering", "crispEdges")
      .attr("stroke", axisGridColor)
      .attr("stroke-width", 1);

    // y Axis.
    svgElement
      .append("g")
      // @todo Wind direction degree/ordinal.
      .call(
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

    // Actual chart lines.
    props.data.forEach((dataSet: any, index: number) => {
      let curve = d3.curveNatural;
      switch (props.nivoProps.curve) {
        case "basis": {
          curve = d3.curveBasis;
          break;
        }
        case "cardinal": {
          curve = d3.curveCardinal;
          break;
        }
        case "catmullRom": {
          curve = d3.curveCatmullRom;
          break;
        }
        case "linear": {
          curve = d3.curveLinear;
          break;
        }
        case "monotoneX": {
          curve = d3.curveMonotoneX;
          break;
        }
        case "monotoneY": {
          curve = d3.curveMonotoneY;
          break;
        }
        case "natural": {
          curve = d3.curveNatural;
          break;
        }
        case "step": {
          curve = d3.curveStep;
          break;
        }
        case "stepAfter": {
          curve = d3.curveStepAfter;
          break;
        }
        case "stepBefore": {
          curve = d3.curveStepBefore;
          break;
        }
        default: {
          curve = d3.curveNatural;
          break;
        }
      }

      const lineGenerator = d3
        .line()
        .x(function (d: any) {
          return xScale(d.x * 1000);
        })
        .y(function (d: any) {
          return yScale(d.y);
        })
        .curve(curve);

      // Dots.
      if (props.nivoProps.enablePoints) {
        svgElement
          .append("g")
          .selectAll("dot")
          .data(dataSet.data)
          .enter()
          .append("circle")
          .attr("cx", (d: any) => {
            return xScale(d["x"] * 1000);
          })
          .attr("cy", (d: any) => {
            return yScale(d["y"]);
          })
          .attr(
            "r",
            props.nivoProps.pointSize ? props.nivoProps.pointSize / 2 : 2.5
          )
          .style("fill", props.color[index]);
      }

      // Area.
      if (props.nivoProps.enableArea) {
        svgElement
          .append("path")
          .datum(dataSet.data as any)
          .attr("fill", props.color[index])
          .attr(
            "fill-opacity",
            darkMode
              ? 0.75
              : props.nivoProps.areaOpacity
              ? props.nivoProps.areaOpacity
              : 0.07
          )
          .attr("stroke-width", 0)
          .style("mix-blend-mode", "normal")
          .attr(
            "d",
            d3
              .area()
              .x((d: any) => xScale(d.x * 1000))
              // @todo Area base line value.
              .y0(yScale(yScaleMin))
              .y1((d: any) => yScale(d.y))
              .curve(curve)
          );
      }

      // Line.
      svgElement
        .append("path")
        .attr("fill", "none")
        //@todo Dark mode color handling.
        .attr("stroke", props.color[index])
        .attr(
          "stroke-width",
          props.nivoProps.lineWidth ? props.nivoProps.lineWidth : 2
        )
        .attr("d", lineGenerator(dataSet.data as any));
    });

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

      // append the x line
      focus
        .append("line")
        .attr("class", "x")
        .style("stroke", "#000")
        .style("stroke-dasharray", "7")
        .style("opacity", 0.75)
        .style("transition", "all 0.35s ease-in-out")
        .attr("y1", 0)
        .attr("y2", height);

      props.data.forEach((dataSet: any, index: number) => {
        // append the y line(s)
        focus
          .append("line")
          .attr("class", `y y-${index}`)
          .style("stroke", "#000")
          //.style("display", "block")
          .style("stroke-dasharray", "7")
          .style("opacity", 0.75)
          .style("transition", "all 0.35s ease-in-out")
          .attr("x1", width)
          .attr("x2", width);

        // append the circle(s) at the intersection
        focus
          .append("circle")
          .attr("class", `y y-${index}`)
          .style("opacity", 0.5)
          .style("fill", "none")
          .style("stroke", "#000")
          .style("transition", "all 0.35s ease-in-out")
          .attr("r", 4);
      });

      svgElement
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function () {
          focus.style("display", null);
          d3.select(tooltipRef.current).style("opacity", 1);
        })
        .on("mouseout", function () {
          focus.style("display", "none");
          d3.select(tooltipRef.current).style("opacity", 0);
        })
        .on("mousemove", (event: MouseEvent) => {
          const pointerX = d3.pointer(event)[0];
          let values: Datum[] = [] as Datum[];

          props.data.forEach((dataSet: any, index: number) => {
            const x0 = xScale.invert(pointerX).getTime();
            const i = d3
              .bisector((d: any) => d.x * 1000)
              .left(props.data[index].data, x0, 1);
            const d0 = props.data[index].data[i - 1];
            const d1 = props.data[index].data[i];

            const d: Datum = x0 - d0.x * 1000 > d1.x * 1000 - x0 ? d1 : d0;

            values = [...values, d];
          });

          setTooltip(values);

          const yAverage =
            values.reduce((a: number, b: Datum) => a + b.y, 0) / values.length;

          // @todo Tooltip position left or right from the cursor.
          d3.select(tooltipRef.current)
            .style(
              "left",
              margin.left +
                xScale(values[0].x * 1000) -
                (tooltipRef.current?.clientWidth as number) / 2 +
                "px"
            )
            .style("top", yScale(yAverage) - 45 + "px");

          values.forEach((d: any, index: number) => {
            focus
              .select(`circle.y.y-${index}`)
              .attr(
                "transform",
                "translate(" + xScale(d.x * 1000) + "," + yScale(d.y) + ")"
              );

            focus
              .select(`line.y.y-${index}`)
              .attr(
                "transform",
                "translate(" + width * -1 + "," + yScale(d.y) + ")"
              )
              .attr("x2", width + width);
          });

          focus
            .select("line.x")
            .attr(
              "transform",
              "translate(" +
                xScale(values[0].x * 1000) +
                "," +
                yScale(d3.max(values, (d: any) => d.y)) +
                ")"
            )
            .attr("y2", height - yScale(d3.max(values, (d: any) => d.y)));
        });
    }
  }, [size, props.data]);

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <svg ref={svgRef} />
      <div
        ref={tooltipRef}
        className="d3-diagram-tooltip"
        style={{
          opacity: 0,
          position: "absolute",
          zIndex: 1000,
          transition: chartTransition,
          pointerEvents: "none",
        }}
      >
        <Tooltip
          tooltips={tooltip}
          color={props.color}
          unit={typeof props.unit === "string" ? [props.unit] : props.unit}
        />
      </div>
    </div>
  );
};
