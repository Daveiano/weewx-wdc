import React, {
  FunctionComponent,
  useEffect,
  useRef,
  useState,
  RefObject,
} from "react";
import * as d3 from "d3";

import { DiagramBaseProps, Series } from "./types";
import type { Size } from "../util/util";
import { useWindowSize } from "../util/util";
import dayjs from "dayjs";

type CombinedDiagramBaseProps = DiagramBaseProps & { chartTypes: string[] };

export const CombinedDiagram: FunctionComponent<CombinedDiagramBaseProps> = (
  props: CombinedDiagramBaseProps
): React.ReactElement => {
  const ref: RefObject<SVGSVGElement> = useRef(null);
  const size: Size = useWindowSize();

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

  console.log(props);
  console.log(combinedData);

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
    d3.select(ref.current).selectChildren().remove();

    // @see https://gist.github.com/mbostock/3019563
    const margin = { top: 20, right: 20, bottom: 20, left: 40 },
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

    // Actual chart line/bars/dots.
    props.data.forEach((dataSet: any, index: number) => {
      // @see http://using-d3js.com/05_04_curves.html
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

      if (props.chartTypes[index] === "line") {
        if (props.nivoProps.enablePoints) {
          // Dots.
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

        if (props.nivoProps.enableArea) {
          // Area.
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
          .attr("stroke", props.color[index])
          .attr(
            "stroke-width",
            props.nivoProps.lineWidth ? props.nivoProps.lineWidth : 2
          )
          .attr("d", lineGenerator(dataSet.data as any));
      }

      if (props.chartTypes[index] === "bar") {
        const xScale2 = d3
            .scaleBand()
            .range([0, width])
            // @todo Configurable date/time.
            // dayjs.unix(d.x).format("DD/MM/YYYY")
            .domain(dataSet.data.map((d: any) => d.x)),
          yScale2 = d3
            .scaleLinear()
            // @todo yScaleMin, yScaleMax does not make sense to have this per chart, needs to be per obs.
            .domain([
              0,
              d3.max(dataSet.data, (d: any) => d.y) as unknown as number,
            ])
            .range([height, 0]);

        // X Axis 2.
        svgElement
          .append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(
            d3
              .axisBottom(xScale2)
              .tickFormat((d: any) => dayjs.unix(d).format("DD/MM/YYYY"))
          )
          .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");

        // y Axis 2.
        svgElement
          .append("g")
          .attr("transform", "translate(" + width + ",0)")
          .call(d3.axisRight(yScale2).ticks(5).tickSize(0).tickPadding(6));

        // Y Axis 2 Label.
        svgElement
          .append("g")
          .attr(
            "transform",
            "translate(" +
              (width - margin.right / 1.5) +
              ", " +
              height / 2 +
              ")"
          )
          .append("text")
          .attr("text-anchor", "middle")
          .attr("font-size", "0.75em")
          .attr("transform", "rotate(-90)")
          .text("Y Axis Label 2");

        // Bars
        svgElement
          .selectAll("bars")
          .data(dataSet.data)
          .join("rect")
          .attr(
            "x",
            (d: any) => (xScale2(d.x) as number) + xScale2.bandwidth() * 0.125
          )
          .attr("y", (d: any) => yScale2(d.y))
          .attr("width", xScale2.bandwidth() * 0.75)
          .attr("height", (d: any) => height - yScale2(d.y))
          .attr("fill", props.color[index]);
      }
    });

    // Axis styling.
    svgElement
      .selectAll(".domain")
      .style("fill", "none")
      .style("stroke", axisGridColor)
      .style("stroke-width", "1");

    // Interactivity.
    // @see  http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html
    const focus = svgElement
      .append("g")
      .style("display", "none")
      .text("TOOLTIP");

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
      });
    //.on("mousemove", mousemove);
  }, [size, props.data]);

  return <svg ref={ref} />;
};
