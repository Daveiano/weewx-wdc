import React, { FunctionComponent, useEffect, useRef, RefObject } from "react";
import * as d3 from "d3";

import { DiagramBaseProps } from "./types";
import type { Size } from "../util/util";
import { useWindowSize } from "../util/util";

const axisGridColor = "#525252";

export const CombinedDiagram: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  const ref: RefObject<SVGSVGElement> = useRef(null);
  const size: Size = useWindowSize();

  console.log(props.data);

  useEffect(() => {
    // Clean up (otherwise on resize it gets rendered multiple times).
    d3.select(ref.current).selectChildren().remove();

    // @see https://gist.github.com/mbostock/3019563
    const margin = { top: 20, right: 20, bottom: 20, left: 40 },
      // @todo React-watch-dimesions plugin, use width and height in state and useEffect.
      width = ref.current?.parentElement
        ? ref.current?.parentElement.clientWidth - margin.left - margin.right
        : 0,
      height = ref.current?.parentElement
        ? ref.current?.parentElement.clientHeight - margin.top - margin.bottom
        : 0,
      xScale = d3
        .scaleTime()
        .domain([
          new Date((props.data[1].data[0].x as number) * 1000),
          new Date(
            (props.data[1].data[props.data[1].data.length - 1].x as number) *
              1000
          ),
        ])
        .range([0, width]),
      yScale = d3
        .scaleLinear()
        .domain([
          // @todo configurable yScaleOffset.
          d3.min(props.data[1].data, (d: any) => d.y) - 3,
          d3.max(props.data[1].data, (d: any) => d.y) + 3,
        ])
        .range([height, 0]);

    const svgElement = d3
      .select(ref.current)
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
      .attr("shape-rendering", "crispEdges")
      .attr("stroke", axisGridColor)
      .attr("stroke-width", "1px");

    // y Axis.
    svgElement
      .append("g")
      .call(d3.axisLeft(yScale).ticks(5).tickSize(0).tickPadding(6));

    // Y Axis Label.
    svgElement
      .append("g")
      .attr(
        "transform",
        "translate(" + -margin.left / 1.5 + ", " + height / 2 + ")"
      )
      .append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "0.75em")
      .attr("transform", "rotate(-90)")
      .text("Y Axis Label");

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

    // Axis styling.
    svgElement
      .selectAll(".domain")
      .style("fill", "none")
      .style("stroke", axisGridColor)
      .style("stroke-width", "1");

    // Dots.
    svgElement
      .append("g")
      .selectAll("dot")
      .data(props.data[1].data)
      .enter()
      .append("circle")
      .attr("cx", (d: any) => {
        return xScale(d["x"] * 1000);
      })
      .attr("cy", (d: any) => {
        return yScale(d["y"]);
      })
      .attr("r", 2)
      .style("fill", "red");

    //const yAccessor = (d) => d.InternetUsage;
    //const dateParser = d3.timeParse("%d/%m/%Y");
    //const xAccessor = (d) => dateParser(d["Bill Date"]);

    const lineGenerator = d3
      .line()
      .x(function (d) {
        //@ts-ignore
        return xScale(d.x * 1000);
      })
      .y(function (d) {
        //@ts-ignore
        return yScale(d.y);
      });

    // Line.
    svgElement
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator(props.data[1].data as any));
  }, [size, props.data]);

  return <svg ref={ref} />;
};
