import React, {
  FunctionComponent,
  useEffect,
  useRef,
  useState,
  RefObject,
} from "react";
import * as d3 from "d3";
import { useMediaQuery } from "@react-hook/media-query";

import { Datum, DiagramBaseProps } from "../types";
import {
  getAxisLeftLegendOffset,
  getMargins,
  Size,
  useWindowSize,
} from "../../util/util";
import { Tooltip } from "./components/tooltip";
import { Maximize } from "../../assets/maximize";
import { addMarkers } from "./components/marker";
import {
  getAxisGridColor,
  chartTransition,
  getColors,
  getCurve,
  getObsPropsFromChartProps,
} from "./../../util/util";
import { addLegend } from "./components/legend";

type LineDiagramBaseProps = DiagramBaseProps & {
  unit: string[];
  locale: d3.TimeLocaleObject;
  observationCombinedKeys: string[];
};

export const D3LineDiagram: FunctionComponent<LineDiagramBaseProps> = (
  props: LineDiagramBaseProps
): React.ReactElement => {
  const svgRef: RefObject<SVGSVGElement> = useRef(null);
  const tooltipRef: RefObject<HTMLDivElement> = useRef(null);
  const small = useMediaQuery("(max-width: 672px)");
  const size: Size = useWindowSize();
  const [tooltip, setTooltip] = useState<Datum[]>([] as Datum[]);

  const windDirOrdinals = (window as any).weewxWdcConfig.diagramWindDirOrdinals;
  const ordinalCompass = (window as any).weewxWdcConfig.ordinalCompass;

  // @todo This adds one MutationObserver per LineDiagram. Add this to one
  //    general component which shares the state.
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Color handling
  const axisGridColor = getAxisGridColor(darkMode);
  const colors = getColors(
    darkMode,
    props.nivoProps,
    props.color,
    props.observation,
    props.observationCombinedKeys
  );

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

  // Group data by unit.
  const dataGroupedByUnit: { unit: string; data: Datum[] }[] = [
    { unit: props.unit[0], data: props.data[0].data },
  ];

  props.unit.forEach((unit, index) => {
    if (index === 0) {
      return;
    }

    const alreadyGrouped = dataGroupedByUnit.find(
      (group) => group.unit === unit
    );

    if (alreadyGrouped) {
      alreadyGrouped.data = [...alreadyGrouped.data, ...props.data[index].data];
      dataGroupedByUnit[
        dataGroupedByUnit.findIndex((group) => group.unit === unit)
      ] = alreadyGrouped;
    } else {
      dataGroupedByUnit.push({
        unit: unit,
        data: props.data[index].data,
      });
    }
  });

  // Locale handling.
  const dateTimeFormat = props.locale.format(
    props.nivoProps.bottom_date_time_format
  );

  let tickValues = 5;
  switch (props.context) {
    case "week":
      tickValues = 5;
      break;
    case "month":
      tickValues = small ? 3 : 5;
      break;
    case "year":
      tickValues = small ? 3 : 5;
      break;
    case "alltime":
      tickValues = small ? 3 : 5;

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
        : 0,
      xScale = d3
        .scaleTime()
        .range([0, width])
        .domain([
          new Date((combinedData[0].x as number) * 1000),
          new Date((combinedData[combinedData.length - 1].x as number) * 1000),
        ]);

    const svgElement = d3
      .select(svgRef.current)
      .attr("data-test", "d3-diagram-svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x Axis.
    svgElement
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("data-test", "x-axis")
      .call(
        d3
          .axisBottom(xScale)
          .ticks(tickValues)
          .tickFormat((d) => dateTimeFormat(d as Date))
          .tickSize(0)
          .tickPadding(6)
      );

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

    let processedUnits: string[] = [];
    const scales: {
      [key: string]: any;
      y: any;
      yScaleMin: number;
    } = {} as any;

    props.data.forEach((serie, index) => {
      if (!processedUnits.includes(props.unit[index])) {
        processedUnits = [...processedUnits, props.unit[index]];

        const unitData = dataGroupedByUnit.find(
          (data) => data.unit === props.unit[index]
        );

        const observationProps = getObsPropsFromChartProps(
          props.nivoProps,
          props.observation[index],
          props.observationCombinedKeys[index]
        );

        const yScaleMin = observationProps.yScaleMin
            ? parseFloat(observationProps.yScaleMin)
            : d3.min(unitData?.data as Datum[], (d: any) => d.y) -
              parseFloat(observationProps.yScaleOffset),
          yScaleMax = observationProps.yScaleMax
            ? parseFloat(observationProps.yScaleMax)
            : d3.max(unitData?.data as Datum[], (d: any) => d.y) +
              parseFloat(observationProps.yScaleOffset),
          yScale = d3
            .scaleLinear()
            .domain([yScaleMin, yScaleMax])
            .range([height, 0]);

        scales[props.unit[index]] = {
          y: yScale,
          yScaleMin,
        };
      }
    });

    // Y Axis.
    let index = 0;
    for (const [unit, value] of Object.entries(scales)) {
      if (index >= 2) {
        return;
      }

      const yScale = value.y;

      // Y Axis left.
      if (index === 0) {
        const windDirAsOridnal =
          props.observation.length === 1 &&
          props.observation[0] === "windDir" &&
          windDirOrdinals;

        svgElement
          .append("g")
          .attr("data-test", "y-axis-left")
          .call(
            d3
              .axisLeft(yScale)
              .ticks(6)
              .tickFormat((d) => {
                return windDirAsOridnal
                  ? ordinalCompass[Math.floor((d as number) / 22.5 + 0.5) % 16]
                  : d.toString();
              })
              .tickSize(0)
              .tickPadding(6)
          );

        // Y Axis Label - only show if not windDir and windDirOrdinals is set.
        if (!windDirAsOridnal) {
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
            .attr("class", "axis-label-left")
            .attr("text-anchor", "middle")
            .attr("font-size", "0.75em")
            .style("dominant-baseline", "central")
            .style("font-family", "sans-serif")
            .text(unit);
        }

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
      }

      // Only draw right axis if there are multiple units.
      if (index > 0) {
        const windDirAsOridnal =
          props.observation[index] === "windDir" && windDirOrdinals;

        svgElement
          .append("g")
          .attr("data-test", "y-axis-right")
          .attr("transform", "translate(" + width + ",0)")
          .call(
            d3
              .axisRight(yScale)
              .ticks(6)
              .tickFormat((d) => {
                return windDirAsOridnal
                  ? ordinalCompass[Math.floor((d as number) / 22.5 + 0.5) % 16]
                  : d.toString();
              })
              .tickSize(0)
              .tickPadding(6)
          );

        // Y Axis Label - only show if not windDir and windDirOrdinals is set.
        if (!windDirAsOridnal) {
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
            .attr("class", "axis-label-right")
            .attr("font-size", "0.75em")
            .style("dominant-baseline", "central")
            .style("font-family", "sans-serif")
            .text(unit);
        }
      }

      index++;
    }

    // Actual chart lines.
    props.data.forEach((dataSet: any, index: number) => {
      const observationProps = getObsPropsFromChartProps(
        props.nivoProps,
        props.observation[index],
        props.observationCombinedKeys[index]
      );

      const curve = getCurve(observationProps.curve);

      const yScale = scales[props.unit[index]]["y"],
        yScaleMin = scales[props.unit[index]]["yScaleMin"],
        lineGenerator = d3
          .line()
          .x(function (d: any) {
            return xScale(d.x * 1000);
          })
          .y(function (d: any) {
            return yScale(d.y);
          })
          .curve(curve);

      // Dots.
      if (observationProps.enablePoints) {
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
            observationProps.pointSize ? observationProps.pointSize / 2 : 2.5
          )
          .style("fill", colors[index]);
      }

      // Area.
      if (observationProps.enableArea) {
        svgElement
          .append("path")
          .datum(dataSet.data as any)
          .attr("fill", colors[index])
          .attr(
            "fill-opacity",
            darkMode
              ? 0.75
              : observationProps.areaOpacity
              ? observationProps.areaOpacity
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
        .attr("data-test", `line-${props.observation[index]}`)
        .attr("stroke", colors[index])
        .attr(
          "stroke-width",
          observationProps.lineWidth ? observationProps.lineWidth : 2
        )
        .attr("d", lineGenerator(dataSet.data as any));
    });

    // Markers.
    if (Object.entries(scales).length === 1) {
      if (props.nivoProps.markerValue) {
        addMarkers(
          svgElement,
          width,
          scales[props.unit[0]]["y"],
          props.unit[0],
          props.nivoProps.markerValue,
          props.nivoProps.markerColor,
          props.nivoProps.markerLabel
        );
      }
    } else {
      props.nivoProps.obs &&
        Object.entries(props.nivoProps.obs).forEach(
          (obs: any, index: number) => {
            if (obs[1].markerValue) {
              addMarkers(
                svgElement,
                width,
                scales[props.unit[index]]["y"],
                props.unit[index],
                obs[1].markerValue,
                obs[1].markerColor,
                obs[1].markerLabel
              );
            }
          }
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

      // Append the x line
      if (props.nivoProps.enableCrosshair) {
        focus
          .append("line")
          .attr("class", "x")
          .style("stroke", darkMode ? "#FFF" : "#000")
          .style("stroke-dasharray", "7")
          .style("opacity", 0.75)
          .style("transition", "all 0.35s ease-in-out")
          .attr("y1", 0)
          .attr("y2", height);

        props.data.forEach((dataSet: any, index: number) => {
          // append the y line(s)
          if (Object.entries(scales).length === 1) {
            focus
              .append("line")
              .attr("class", `y y-${index}`)
              .style("stroke", darkMode ? "#FFF" : "#000")
              //.style("display", "block")
              .style("stroke-dasharray", "7")
              .style("opacity", 0.75)
              .style("transition", "all 0.35s ease-in-out")
              .attr("x1", width)
              .attr("x2", width);
          }

          // append the circle(s) at the intersection
          focus
            .append("circle")
            .attr("class", `y y-${index}`)
            .style("opacity", 0.75)
            .style("fill", "none")
            .style("stroke", axisGridColor)
            .style("transition", "all 0.35s ease-in-out")
            .attr("r", 4);
        });
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

          props.data.forEach((dataSet: any, index: number) => {
            const x0 = xScale.invert(pointerX).getTime();
            let i = d3
              .bisector((d: any) => d.x * 1000)
              .left(props.data[index].data, x0, 1);

            if (i <= 0) {
              i = 1;
            } else if (i >= props.data[index].data.length) {
              i = props.data[index].data.length - 1;
            }

            const d0 = props.data[index].data[i - 1];
            const d1 = props.data[index].data[i];

            const d: Datum = x0 - d0.x * 1000 > d1.x * 1000 - x0 ? d1 : d0;

            values = [...values, d];
          });

          setTooltip(values);

          // Combined tooltip position left or right from the cursor.
          if (props.data.length > 1) {
            // Is the cursor in the right half or in the left half of the chart?
            if (pointerX > width / 2) {
              // Right.
              d3.select(tooltipRef.current).style(
                "left",
                margin.left +
                  xScale(values[0].x * 1000) -
                  (tooltipRef.current?.clientWidth as number) -
                  20 +
                  "px"
              );
            } else {
              // Left.
              d3.select(tooltipRef.current).style(
                "left",
                margin.left + xScale(values[0].x * 1000) + 20 + "px"
              );
            }
          } else {
            d3.select(tooltipRef.current).style(
              "left",
              margin.left +
                xScale(values[0].x * 1000) -
                (tooltipRef.current?.clientWidth as number) / 2 +
                "px"
            );
          }

          d3.select(tooltipRef.current).style(
            "top",
            d3.pointer(event)[1] -
              (tooltipRef.current?.clientHeight as number) / 2 +
              "px"
          );

          if (props.nivoProps.enableCrosshair) {
            values.forEach((d: any, index: number) => {
              const yScale = scales[props.unit[index]]["y"];

              focus
                .select(`circle.y.y-${index}`)
                .attr(
                  "transform",
                  "translate(" + xScale(d.x * 1000) + "," + yScale(d.y) + ")"
                );

              if (Object.entries(scales).length === 1) {
                focus
                  .select(`line.y.y-${index}`)
                  .attr(
                    "transform",
                    "translate(" + width * -1 + "," + yScale(d.y) + ")"
                  )
                  .attr("x2", width + width);
              }
            });

            if (Object.entries(scales).length === 1) {
              focus
                .select("line.x")
                .attr(
                  "transform",
                  "translate(" +
                    xScale(values[0].x * 1000) +
                    "," +
                    scales[props.unit[0]]["y"](
                      d3.max(values, (d: any) => d.y)
                    ) +
                    ")"
                )
                .attr(
                  "y2",
                  height -
                    scales[props.unit[0]]["y"](d3.max(values, (d: any) => d.y))
                );
            } else {
              focus
                .select("line.x")
                .attr(
                  "transform",
                  "translate(" + xScale(values[0].x * 1000) + "," + 0 + ")"
                )
                .attr("y2", height);
            }
          }
        });

      // Legend.
      addLegend(
        svgElement,
        width,
        props.data,
        props.unit,
        colors,
        unitCombinedDistinct.length > 1
      );
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
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          data-test="d3-diagram-svg"
        />
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
            dateTimeFormat={props.nivoProps.tooltip_date_time_format}
            locale={props.locale}
          />
        </div>
      </div>
    </>
  );
};
