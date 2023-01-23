import React, {
  FunctionComponent,
  useState,
  useEffect,
  useRef,
  RefObject,
} from "react";
import * as d3 from "d3";

import { DiagramBaseProps } from "./types";
import type { Series } from "./types";

export const CombinedDiagram: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  const ref: RefObject<SVGSVGElement> = useRef(null);

  console.log(props.data);

  useEffect(() => {
    const svgElement = d3.select(ref.current),
      margin = 20,
      width = ref.current?.clientWidth ? ref.current?.clientWidth - margin : 0,
      height = ref.current?.clientHeight
        ? ref.current?.clientHeight - margin
        : 0,
      xScale = d3
        .scaleTime()
        //.nice()
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
          Math.min(...props.data[1].data.map((item: any) => item.y)),
          Math.max(...props.data[1].data.map((item: any) => item.y)),
        ])
        .range([height, 0]);

    // x Axis.
    svgElement
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    // y Axis.
    svgElement
      .append("g")
      .attr("transform", "translate(" + margin + ",0)")
      .call(d3.axisLeft(yScale));

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
      .style("fill", "#CC0000");
  }, []);

  return (
    <svg
      ref={ref}
      width="100%"
      height="100%"
      style={{
        height: "100%",
        width: "100%",
        marginRight: "0px",
        marginLeft: "0px",
      }}
    />
  );
};
