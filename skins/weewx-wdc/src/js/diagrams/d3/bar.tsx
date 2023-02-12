import React, {
  FunctionComponent,
  useEffect,
  useRef,
  useState,
  RefObject,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as d3 from "d3";

import { DiagramBaseProps, Series } from "../types";
import { getAxisLeftLegendOffset, getMargins, Size } from "../../util/util";
import { useWindowSize } from "../../util/util";
import dayjs from "dayjs";

export const D3BarDiagram: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  const svgRef: RefObject<SVGSVGElement> = useRef(null);
  const tooltipRef: RefObject<HTMLDivElement> = useRef(null);
  const size: Size = useWindowSize();
  const [tooltip, setTooltip] = useState<{ x: number; y: number }[]>(
    props.data.map(() => ({ x: 0, y: 0 }))
  );

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
        .scaleBand()
        .range([0, width])
        // @todo Configurable date/time.
        // dayjs.unix(d.x).format("DD/MM/YYYY")
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
      // @todo configurable tick date/time format.
      .call(
        d3
          .axisBottom(xScale)
          .tickFormat((d) => dayjs.unix(parseInt(d)).format("DD.MM"))
          .tickSize(0)
          .tickPadding(6)
      );

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

    // Actual chart bars.
    props.data.forEach((dataSet: any, index: number) => {
      // Bars
      // @todo nivoProps bar label.
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
        // @todo Dark mode handling.
        .attr("fill", props.color[index]);
    });

    // Axis styling.
    svgElement
      .selectAll(".domain")
      .style("fill", "none")
      .style("stroke", axisGridColor)
      .style("stroke-width", "1");

    // Interactivity.
    // @see  http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html
    const focus = svgElement.append("g").style("display", "none");

    // append the x line
    focus
      .append("line")
      .attr("class", "x")
      .style("stroke", "#000")
      .style("stroke-dasharray", "7")
      .style("opacity", 0.75)
      .attr("y1", 0)
      .attr("y2", height);

    // append the y line
    focus
      .append("line")
      .attr("class", "y")
      .style("stroke", "#000")
      .style("stroke-dasharray", "7")
      .style("opacity", 0.75)
      .attr("x1", width)
      .attr("x2", width);

    focus
      .append("circle")
      .attr("class", "y")
      .style("opacity", 0.5)
      .style("fill", "none")
      .style("stroke", "#000")
      //@todo Temporary hidden.
      .style("display", "none")
      .attr("r", 4);

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
        // const x0 = xScale.invert(d3.pointer(event)[0]).getTime();
        // const i = d3
        //   .bisector((d: any) => d.x * 1000)
        //   .left(props.data[0].data, x0, 1);
        // const d0 = props.data[0].data[i - 1];
        // const d1 = props.data[0].data[i];
        // const d = x0 - d0.x * 1000 > d1.x * 1000 - x0 ? d1 : d0;
        // setTooltip([
        //   { x: d.x, y: d.y },
        //   { x: 0, y: 0 },
        // ]);
        // d3.select(tooltipRef.current)
        //   .style("display", "block")
        //   .style(
        //     "left",
        //     event.pageX - (tooltipRef.current?.clientWidth as number) / 2 + "px"
        //   )
        //   .style("top", event.pageY - 25 + "px");
        // focus
        //   .select("circle.y")
        //   .attr(
        //     "transform",
        //     "translate(" +
        //       xScale((d.x * 1000).toString()) +
        //       "," +
        //       yScale(d.y) +
        //       ")"
        //   );
        // focus
        //   .select("line.x")
        //   .attr(
        //     "transform",
        //     "translate(" +
        //       xScale((d.x * 1000).toString()) +
        //       "," +
        //       yScale(d.y) +
        //       ")"
        //   )
        //   .attr("y2", height - yScale(d.y));
        // focus
        //   .select("line.y")
        //   .attr(
        //     "transform",
        //     "translate(" + width * -1 + "," + yScale(d.y) + ")"
        //   )
        //   .attr("x2", width + width);
      });
  }, [size, props.data]);

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <svg ref={svgRef} />
      <div
        ref={tooltipRef}
        className="d3-diagram-tooltip"
        style={{ display: "none", position: "fixed", zIndex: 1000 }}
      >
        <div
          style={{
            padding: "7px",
            color: "white",
            borderLeft: `5px solid red`,
            textAlign: "right",
          }}
          className="diagram-tooltip"
        >
          <div style={{ marginBottom: "5px" }}>
            {/*@todo configurable date/time*/}
            {dayjs.unix(tooltip[0].x).format("DD.MM.YYYY HH:mm")}
          </div>
          <div>
            {tooltip[0].y} {props.unit[0]}
          </div>
        </div>
      </div>
    </div>
  );
};
