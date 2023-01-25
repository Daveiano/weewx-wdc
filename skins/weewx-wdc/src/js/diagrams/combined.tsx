import React, {
  FunctionComponent,
  useState,
  useEffect,
  useRef,
  RefObject,
} from "react";
import * as d3 from "d3";

import { DiagramBaseProps } from "./types";
import type { Series, Datum } from "./types";
import { Serie } from "@nivo/line";

export const CombinedDiagram: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  const ref: RefObject<SVGSVGElement> = useRef(null);

  console.log(props.data);

  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 20, left: 20 },
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
          d3.min(props.data[1].data, (d: any) => d.y),
          d3.max(props.data[1].data, (d: any) => d.y),
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
      .call(d3.axisBottom(xScale));

    // y Axis.
    svgElement.append("g").call(d3.axisLeft(yScale));

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
      //.datum(props.data[1].data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", lineGenerator(props.data[1].data as any));
  }, []);

  return <svg ref={ref} />;
};
