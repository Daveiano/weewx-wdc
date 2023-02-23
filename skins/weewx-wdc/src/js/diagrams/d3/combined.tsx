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
import {
  useWindowSize,
  getMargins,
  Size,
  getAxisLeftLegendOffset,
} from "../../util/util";
import {
  chartTransition,
  getAxisGridColor,
  getColors,
  getCurve,
} from "./components/util";
import { Maximize } from "../../assets/maximize";
import { Tooltip } from "./components/tooltip";
import { addLegend } from "./components/legend";

type CombinedDiagramBaseProps = DiagramBaseProps & {
  chartTypes: string[];
  observation: string[];
  unit: string[];
};

export const CombinedDiagram: FunctionComponent<CombinedDiagramBaseProps> = (
  props: CombinedDiagramBaseProps
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
  const axisGridColor = getAxisGridColor(darkMode);
  const colors = getColors(darkMode, props.nivoProps.enableArea, props.color);

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
    const unitCombinedDistinct: string[] = [...new Set(props.unit)];

    // @see https://gist.github.com/mbostock/3019563
    const margin = {
        top: 20,
        // Second axis on the right?
        right: unitCombinedDistinct.length > 1 ? 50 : 10,
        bottom: 20,
        left: getMargins(props.observation[0]).left - 2.5,
      },
      width = svgRef.current?.parentElement
        ? svgRef.current?.parentElement.clientWidth - margin.left - margin.right
        : 0,
      height = svgRef.current?.parentElement
        ? svgRef.current?.parentElement.clientHeight -
          margin.top -
          margin.bottom
        : 0;

    const svgElement = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const dataGroupedByUnit: any = {},
      scales: {
        [key: string]: any;
        x: any;
        y: any;
        yScaleMin: number;
      } = {} as any;

    // @todo First calculate dataGroupedByUnit,
    // then use this to calculate the scales (yScaleOffset
    // relative to all values of unit (dataGroupedByUnit)).

    // Group data per unit. First only process bar scales bc we need them later for the line scales.
    props.data.forEach((serie, index) => {
      // Unit not yet added/proccessed.
      if (!dataGroupedByUnit[props.unit[index]]) {
        if (props.chartTypes[index] === "bar") {
          dataGroupedByUnit[props.unit[index]] = [];

          const xScale = d3
            .scaleBand()
            .range([0, width])
            // @todo Configurable date/time.
            // dayjs.unix(d.x).format("DD/MM/YYYY")
            .domain(serie.data.map((d: any) => d.x));

          // @todo Should be obs specific?
          // @todo Hard coded yScaleMax.
          const yScaleMax = d3.max(serie.data, (d: any) => d.y) + 0.5,
            yScale = d3
              .scaleLinear()
              // @todo yScaleMin, yScaleMax does not make sense to have this per chart, needs to be per obs.
              .domain([0, yScaleMax])
              .range([height, 0]);

          scales[props.unit[index]] = {
            x: xScale,
            y: yScale,
          };

          dataGroupedByUnit[props.unit[index]].push({
            ...serie,
            unit: props.unit[index],
          });
        }
      }
    });

    props.data.forEach((serie, index) => {
      if (!dataGroupedByUnit[props.unit[index]]) {
        if (props.chartTypes[index] === "line") {
          dataGroupedByUnit[props.unit[index]] = [];

          const barScaleOffset =
              scales[
                props.unit[props.chartTypes.indexOf("bar")]
              ].x.bandwidth() / 2,
            xScale = d3
              .scaleTime()
              .domain([
                new Date((combinedData[0].x as number) * 1000),
                new Date(
                  (combinedData[combinedData.length - 1].x as number) * 1000
                ),
              ])
              .range([barScaleOffset, width - barScaleOffset]),
            // @todo Should be obs specific?
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

          scales[props.unit[index]] = {
            x: xScale,
            y: yScale,
            yScaleMin,
          };

          dataGroupedByUnit[props.unit[index]].push({
            ...serie,
            unit: props.unit[index],
          });
        }
      }
    });

    // Draw Axes.
    // X Axis - use bar scaleBand for axis bottom.
    const barCharUnit = props.unit[props.chartTypes.indexOf("bar")];

    svgElement
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(scales[barCharUnit]["x"])
          .tickSize(0)
          .tickPadding(6)
          .tickFormat((d: any) => dayjs.unix(d).format("DD/MM"))
      );

    // Y Axis, first sort the scales by the order of the units (data).
    const sortedScales = Object.entries(scales).sort((a, b) => {
      return props.unit.indexOf(a[0]) - props.unit.indexOf(b[0]);
    });

    let index = 0;
    for (const [unit, value] of sortedScales) {
      if (index >= 2) {
        return;
      }

      // Y Axis left.
      if (index === 0) {
        svgElement
          .append("g")
          // @todo Wind direction degree/ordinal.
          .call(
            d3
              .axisLeft(value["y"])
              .ticks(6)
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
            `translate(${
              getAxisLeftLegendOffset(
                props.observation[props.unit.indexOf(unit)]
              ) + 2.25
            }, ${height / 2}), rotate(-90)`
          )
          .append("text")
          .attr("text-anchor", "middle")
          .attr("font-size", "0.75em")
          .style("dominant-baseline", "central")
          .style("font-family", "sans-serif")
          .text(unit);

        // Y Axis Grid.
        svgElement
          .selectAll("line.horizontalGrid")
          .data(value["y"].ticks())
          .enter()
          .append("line")
          .attr("class", "horizontalGrid")
          .attr("x1", 1)
          .attr("x2", width)
          .attr("y1", function (d) {
            return value["y"](d);
          })
          .attr("y2", function (d) {
            return value["y"](d);
          })
          .attr("fill", "none")
          .attr("shape-rendering", "crispEdges")
          .attr("stroke", axisGridColor)
          .attr("stroke-width", "1px");
      }

      // Only draw right axis if there are multiple units.
      if (index > 0) {
        svgElement
          .append("g")
          .attr("transform", "translate(" + width + ",0)")
          .call(
            d3
              .axisRight(value["y"])
              .ticks(6)
              .tickSize(0)
              .tickPadding(6)
              .tickFormat((d) => {
                return d.toString();
              })
          );

        // Y Axis Label.
        svgElement
          .append("g")
          .attr(
            "transform",
            `translate(${
              -getAxisLeftLegendOffset(
                props.observation[props.unit.indexOf(unit)]
              ) -
              2.25 +
              width
            }, ${height / 2}), rotate(90)`
          )
          .append("text")
          .attr("text-anchor", "middle")
          .attr("font-size", "0.75em")
          .style("dominant-baseline", "central")
          .style("font-family", "sans-serif")
          .text(unit);
      }

      index++;
    }

    // Draw Data.
    props.data.forEach((serie, index) => {
      if (props.chartTypes[index] === "line") {
        const curve = getCurve(props.nivoProps.curve);
        const lineGenerator = d3
          .line()
          .x(function (d: any) {
            return scales[props.unit[index]]["x"](d.x * 1000); //+
            //scales[props.unit[props.chartTypes.indexOf("bar")]][
            //  "x"
            //].bandwidth() /
            //  2
          })
          .y(function (d: any) {
            return scales[props.unit[index]]["y"](d.y);
          })
          .curve(curve);
        // Dots.
        if (props.nivoProps.enablePoints) {
          svgElement
            .append("g")
            .selectAll("dot")
            .data(serie.data)
            .enter()
            .append("circle")
            .attr("cx", (d: any) => {
              return scales[props.unit[index]]["x"](d["x"] * 1000);
            })
            .attr("cy", (d: any) => {
              return scales[props.unit[index]]["y"](d["y"]);
            })
            .attr(
              "r",
              props.nivoProps.pointSize ? props.nivoProps.pointSize / 2 : 2.5
            )
            .style("fill", colors[index]);
        }

        // Area.
        if (props.nivoProps.enableArea) {
          svgElement
            .append("path")
            .datum(serie.data as any)
            .attr("fill", colors[index])
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
                .x((d: any) => scales[props.unit[index]]["x"](d.x * 1000))
                // @todo Area base line value.
                .y0(
                  scales[props.unit[index]]["y"](
                    scales[props.unit[index]]["yScaleMin"]
                  )
                )
                .y1((d: any) => scales[props.unit[index]]["y"](d.y))
                .curve(curve)
            );
        }

        // Line.
        svgElement
          .append("path")
          .attr("fill", "none")
          //@todo Dark mode color handling.
          .attr("stroke", colors[index])
          .attr(
            "stroke-width",
            props.nivoProps.lineWidth ? props.nivoProps.lineWidth : 2
          )
          .attr("d", lineGenerator(serie.data as any));
      }

      if (props.chartTypes[index] === "bar") {
        // Bars
        svgElement
          .selectAll("bars")
          .data(serie.data)
          .join("rect")
          .attr(
            "x",
            (d: any) =>
              (scales[props.unit[index]]["x"](d.x) as number) +
              scales[props.unit[index]]["x"].bandwidth() * 0.125
          )
          .attr("y", (d: any) => scales[props.unit[index]]["y"](d.y))
          .attr("width", scales[props.unit[index]]["x"].bandwidth() * 0.75)
          .attr(
            "height",
            (d: any) => height - scales[props.unit[index]]["y"](d.y)
          )
          // @todo Dark mode handling.
          .attr("fill", colors[index]);

        if (props.nivoProps.enableLabel) {
          svgElement
            .selectAll(".text")
            .data(serie.data.filter((d: any) => d.y > 0))
            .enter()
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr(
              "x",
              (d: any) =>
                (scales[props.unit[index]]["x"](d.x) as number) +
                scales[props.unit[index]]["x"].bandwidth() / 2
            )
            .attr("y", (d: any) => scales[props.unit[index]]["y"](d.y) + 5)
            .attr("dy", ".75em")
            .style("font-size", "0.75em")
            .text(function (d: any) {
              return d.y;
            });
        }
      }
    });

    // Axis styling.
    svgElement
      .selectAll(".domain")
      .style("fill", "none")
      .style("stroke", axisGridColor)
      .style("stroke-width", "1");

    // Legend.
    addLegend(svgElement, width, props.data, props.unit, props.color, true);

    // Interactivity.
    // @see  http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html
    const focus = svgElement.append("g").style("display", "none");

    if (props.nivoProps.enableCrosshair) {
      // Append the x line
      focus
        .append("line")
        .attr("class", "x")
        .style("stroke", darkMode ? "#FFF" : "#000")
        .style("stroke-dasharray", "7")
        .style("opacity", 0.75)
        .style("transition", "all 0.35s ease-in-out")
        .attr("y1", 0)
        .attr("y2", height);
    }

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
        let tooltipX = 0;

        props.data.forEach((dataSet: any, index: number) => {
          if (props.chartTypes[index] === "line") {
            const x0 = scales[props.unit[index]]["x"]
              .invert(pointerX)
              .getTime();
            let i = d3
              .bisector((d: any) => d.x * 1000)
              .left(dataSet.data, x0, 1);

            if (i <= 0) {
              i = 1;
            } else if (i >= dataSet.data.length) {
              i = dataSet.data.length - 1;
            }

            const d0 = dataSet.data[i - 1];
            const d1 = dataSet.data[i];

            const d: Datum = x0 - d0.x * 1000 > d1.x * 1000 - x0 ? d1 : d0;

            values = [...values, d];

            tooltipX = scales[props.unit[index]]["x"](d.x * 1000);
          }
          if (props.chartTypes[index] === "bar") {
            const xScaleStep = scales[props.unit[index]]["x"].step();
            let i = Math.floor(d3.pointer(event)[0] / xScaleStep);

            if (i < 0) {
              i = 0;
            } else if (i > dataSet.data.length - 1) {
              i = dataSet.data.length - 1;
            }

            const d = dataSet.data[i];

            values = [...values, d];
          }
        });

        setTooltip(values);

        // Is the cursor in the right half or in the left half of the chart?
        if (pointerX > width / 2) {
          // Right.
          d3.select(tooltipRef.current).style(
            "left",
            margin.left +
              tooltipX -
              (tooltipRef.current?.clientWidth as number) -
              20 +
              "px"
          );
        } else {
          // Left.
          d3.select(tooltipRef.current).style(
            "left",
            margin.left + tooltipX + 20 + "px"
          );
        }

        if (props.nivoProps.enableCrosshair) {
          focus
            .select("line.x")
            .attr("transform", "translate(" + tooltipX + "," + 0 + ")")
            .attr("y2", height);
        }

        d3.select(tooltipRef.current).style(
          "top",
          d3.pointer(event)[1] -
            (tooltipRef.current?.clientHeight as number) / 2 +
            "px"
        );
      });
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
        <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" />
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
            context={props.context}
            tooltips={tooltip}
            color={colors}
            unit={typeof props.unit === "string" ? [props.unit] : props.unit}
          />
        </div>
      </div>
    </>
  );
};
