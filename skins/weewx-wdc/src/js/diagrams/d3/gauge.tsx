/*
 * Copyright David Baetge
 * Gauges source is from Luc Iyer, https://gist.github.com/luciyer/44f77cc54f3a48be83581b637e36ceb5
 */

import React, {
  FunctionComponent,
  useEffect,
  useRef,
  useState,
  RefObject,
  useCallback,
} from "react";

import * as d3 from "d3";
import he from "he";

import { truncate } from "../../util/util";

type GaugeDiagramBaseProps = {
  current: number;
  min: number;
  max: number;
  unit: string;
  obs: string;
  rounding: number;
  label: string;
  seriesName: string;
  properties: {
    min?: string;
    max?: string;
    offset: string;
    tick_number: string;
    arc: string;
    mode: "invert" | "normal";
    color_scheme: string;
    invert_color_scheme: string;
    show_min_max: string;
  };
};

export const D3GaugeDiagram: FunctionComponent<GaugeDiagramBaseProps> = (
  props: GaugeDiagramBaseProps
): React.ReactElement => {
  const [current, setCurrent] = useState(
    isNaN(props.current) ? 0 : props.current
  );

  const [min, setMin] = useState(props.min);
  const [max, setMax] = useState(props.max);

  const windDirOrdinals = (window as any).weewxWdcConfig.diagramWindDirOrdinals;
  const ordinalCompass = (window as any).weewxWdcConfig.ordinalCompass;
  const windDirAsOridnal = props.obs === "windDir" && windDirOrdinals;

  const svgRef: RefObject<SVGSVGElement> = useRef(null);
  const diagram = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [small, setSmall] = useState(false);
  // @todo This adds one MutationObserver per LineDiagram. Add this to one
  //    general component which shares the state.
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

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

  const handleScreenSizeChange = useCallback(() => {
    if (diagram.current) {
      setDimensions({
        width: diagram.current.clientWidth,
        height: diagram.current.clientHeight,
      });

      if (
        diagram.current.clientWidth < 300 ||
        diagram.current.clientHeight < 200
      ) {
        setSmall(true);
      } else {
        setSmall(false);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleScreenSizeChange);
    return () => {
      window.removeEventListener("resize", handleScreenSizeChange);
    };
  }, [handleScreenSizeChange]);

  useEffect(() => {
    handleScreenSizeChange();

    // MQTT handling.
    const gaugeData = (window as any)[props.seriesName];
    const gaugeProxy = new Proxy(gaugeData, {
      set: function (target, key, value) {
        console.log(`${String(key)} set to ${value}`);
        target[key] = value;

        if (String(key) === "current") {
          setCurrent(parseFloat(value));
        }

        if (String(key) === "min" && parseFloat(value) < min) {
          setMin(parseFloat(value));
        }

        if (String(key) === "max" && parseFloat(value) > max) {
          setMax(parseFloat(value));
        }

        return true;
      },
    });
    (window as any)[props.seriesName] = gaugeProxy;

    const mutationObserver = new MutationObserver(callback);
    mutationObserver.observe(document.documentElement, { attributes: true });
    return () => {
      mutationObserver.disconnect();
    };
  }, []);

  const pi = Math.PI,
    rad = pi / 180,
    deg = 180 / pi;

  const margin = small ? 0 : 10,
    rotation = props.obs === "windDir" ? 180 : 0,
    thickness = 0.15,
    arc = parseFloat(props.properties.arc),
    ticksNumber = parseInt(props.properties.tick_number),
    color_step = 120,
    tick_color = darkMode ? "#393939" : "#ffffff", //darkMode ? "#525252" : "#dddddd",
    needle_color = darkMode ? "#f4f4f4" : "#161616",
    needleValue = current,
    center = {
      x: dimensions.width / 2,
      y: dimensions.height - margin,
    },
    radii = {
      base: 0,
      cap: 0,
      inner: 0,
      outer_tick: 0,
      tick_label: 0,
    },
    angles = {
      arc_complement: 0,
      start_angle: 0,
      end_angle: 0,
    },
    scales = {
      lineRadial: d3.lineRadial(),
      subArcScale: d3.arc(),
      gaugeArcScale: d3.arc(),
      needleScale: d3.scaleLinear(),
    };

  const scaleMax = props.properties.max
      ? parseFloat(props.properties.max)
      : Math.round(max + parseFloat(props.properties.offset)),
    scaleMin = props.properties.min
      ? parseFloat(props.properties.min)
      : Math.round(min - parseFloat(props.properties.offset));

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) {
      return;
    }

    d3.select(svgRef.current).selectChildren().remove();

    // Set radii
    const base = dimensions.height - 2 * margin;
    (radii.base = base),
      (radii.cap = base / 15),
      (radii.inner = base * (1 - thickness)),
      (radii.outer_tick = base + 5),
      (radii.tick_label = base + 15);

    // Set angles
    const arc_complement = 1 - arc;
    (angles.arc_complement = arc_complement),
      (angles.start_angle =
        -pi / 2 + (pi * arc_complement) / 2 + rotation * rad),
      (angles.end_angle = pi / 2 - (pi * arc_complement) / 2 + rotation * rad);

    // Set ticks
    const sub_arc_ticks =
        (angles.end_angle - angles.start_angle) / (ticksNumber - 1),
      tick_pct = (scaleMax - scaleMin) / (ticksNumber - 1);

    const ticks = d3.range(ticksNumber).map(function (d) {
      const sub_angle = angles.start_angle + sub_arc_ticks * d;
      let label =
        (scaleMin + d * tick_pct).toFixed(props.rounding) +
        he.decode(props.unit);

      if (windDirAsOridnal) {
        label =
          ordinalCompass[
            Math.floor((scaleMin + d * tick_pct) / 22.5 + 0.5) % 16
          ];
      } else {
        if (arc >= 1.97 && d == 0) {
          label = "";
        }

        if (arc >= 1.97 && d == ticksNumber - 1) {
          label = `${label} / ${
            (scaleMin + 0 * tick_pct).toFixed(props.rounding) +
            he.decode(props.unit)
          }`;
        }
      }

      return {
        label: small ? truncate(label, 7) : label,
        angle: sub_angle,
        coordinates: [
          [sub_angle, radii.inner],
          [sub_angle, radii.outer_tick],
        ],
      };
    });

    // Set scales
    scales.lineRadial = d3.lineRadial();

    scales.subArcScale = d3
      .arc()
      .innerRadius(radii.inner + 1)
      .outerRadius(radii.base)
      .startAngle((d: any) => d.start)
      .endAngle((d: any) => d.end);

    scales.needleScale = d3
      .scaleLinear()
      .domain([scaleMin, scaleMax])
      .range([angles.start_angle, angles.end_angle]);

    scales.gaugeArcScale = d3
      .arc()
      .innerRadius(radii.inner + 1)
      .outerRadius(radii.base)
      .startAngle(angles.start_angle)
      .endAngle(angles.end_angle);

    const valueMinAngle = scales.needleScale(min),
      valueMaxAngle = scales.needleScale(max);

    d3.schemeGreens;

    // Set gradient, @see https://observablehq.com/@d3/color-schemes
    /* @ts-ignore */
    const c = d3[props.properties.color_scheme], //d3.interpolateTurbo, //d3.interpolateGreys, //d3.scaleSequential(["blue", "red"]), //d3[color_scheme],
      samples = color_step,
      total_arc = valueMaxAngle - valueMinAngle,
      sub_arc_gradient = total_arc / samples;

    const gradient = d3.range(samples).map(function (d) {
      const sub_color = d / (samples - 1),
        sub_start_angle = valueMinAngle + sub_arc_gradient * d,
        sub_end_angle = sub_start_angle + sub_arc_gradient;

      return {
        fill: parseInt(props.properties.invert_color_scheme)
          ? c(1 - sub_color)
          : c(sub_color),
        start: sub_start_angle,
        end: sub_end_angle,
      };
    });

    const total_arc_full = angles.end_angle - angles.start_angle,
      sub_arc_gradient_full = total_arc_full / samples;

    const gradientFull = d3.range(samples).map(function (d) {
      const sub_color = d / (samples - 1),
        sub_start_angle = angles.start_angle + sub_arc_gradient_full * d,
        sub_end_angle = sub_start_angle + sub_arc_gradient_full;

      return {
        fill: parseInt(props.properties.invert_color_scheme)
          ? c(1 - sub_color)
          : c(sub_color),
        start: sub_start_angle,
        end: sub_end_angle,
      };
    });

    const svgElement = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("viewBox", [0, 0, dimensions.width, dimensions.height]);

    svgElement
      .append("filter")
      .attr("id", "desaturate")
      .append("feColorMatrix")
      .attr("type", "saturate")
      .attr("in", "SourceGraphic")
      .attr("values", ".25");

    const gaugeChart = svgElement
      .append("g")
      .attr("class", "gauge-container")
      .attr("transform", `translate(${center.x}, ${center.y})`);

    if (props.properties.mode === "invert") {
      // Gradient scale.
      gaugeChart
        .append("g")
        .attr("class", "gauge-arc")
        .selectAll("path")
        .data(gradientFull)
        .enter()
        .append("path")
        .attr("d", scales.subArcScale as any)
        .attr("fill", (d) => d.fill)
        .attr("stroke-width", 0.5)
        .attr("stroke", (d) => d.fill);

      // Darken from start to min value.
      gaugeChart
        .append("path")
        .attr(
          "d",
          d3
            .arc()
            .innerRadius(radii.inner + 1)
            .outerRadius(radii.base)
            .startAngle(angles.start_angle)
            .endAngle(scales.needleScale(min)) as any
        )
        .attr("fill", darkMode ? "#666666" : "#afafaf")
        .style("opacity", 0.85)
        .attr("stroke-width", 0.5)
        .attr("stroke", darkMode ? "#666666" : "#afafaf");
      //.attr("filter", "url(#desaturate)");

      // Darken from max to end.
      gaugeChart
        .append("path")
        .attr(
          "d",
          d3
            .arc()
            .innerRadius(radii.inner + 1)
            .outerRadius(radii.base)
            .startAngle(scales.needleScale(max))
            .endAngle(angles.end_angle) as any
        )
        .attr("fill", darkMode ? "#666666" : "#afafaf")
        .style("opacity", 0.85)
        .attr("filter", "url(#desaturate)")
        .attr("stroke-width", 0.5)
        .attr("stroke", darkMode ? "#666666" : "#afafaf");
    } else {
      // Background scale.
      gaugeChart
        .append("path")
        .attr("d", scales.gaugeArcScale as any)
        .attr("fill", darkMode ? "#666666" : "#afafaf");

      // Gradient scale (from min to max).
      gaugeChart
        .append("g")
        .attr("class", "gauge-arc")
        .selectAll("path")
        .data(gradient)
        .enter()
        .append("path")
        .attr("d", scales.subArcScale as any)
        .attr("fill", (d) => d.fill)
        .attr("stroke-width", 0.5)
        .attr("stroke", (d) => d.fill);
    }

    gaugeChart
      .append("g")
      .attr("class", "gauge-ticks")
      .selectAll("path")
      .data(ticks)
      .enter()
      .append("g")
      .attr("class", "tick")
      .append("path")
      .attr("d", (d: any) => scales.lineRadial(d.coordinates))
      .attr("stroke", tick_color)
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round")
      .attr("fill", "none");

    gaugeChart
      .select("g.gauge-ticks")
      .selectAll("text")
      .data(ticks)
      .enter()
      .append("g")
      .attr("class", "tick-label")
      .append("text")
      .attr(
        "transform",
        (d) =>
          `translate(${radii.tick_label * Math.sin(d.angle)},
                       ${-radii.tick_label * Math.cos(d.angle)})
              rotate(${d.angle * deg - pi})`
      )
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("font-size", "1em")
      .text((d) => d.label);

    gaugeChart
      .append("g")
      .attr("class", "current-ticks")
      .selectAll("path")
      .data([
        {
          coordinates: [
            [scales.needleScale(min), radii.inner],
            [scales.needleScale(min), radii.outer_tick - 6],
          ],
          label: "min",
          color: "#313695",
        },
        {
          coordinates: [
            [scales.needleScale(max), radii.inner],
            [scales.needleScale(max), radii.outer_tick - 6],
          ],
          label: "max",
          color: "#a50026",
        },
        {
          coordinates: [
            [scales.needleScale(needleValue), radii.inner],
            [scales.needleScale(needleValue), radii.outer_tick - 4],
          ],
          label: "current",
          color: needle_color,
        },
      ])
      .enter()
      .append("g")
      .attr("class", (d: any) => `tick-${d.label}`)
      .append("path")
      .attr("d", (d: any) => scales.lineRadial(d.coordinates))
      .attr("stroke", (d: any) => d.color)
      .attr("stroke-width", (d: any) => (d.label === "current" ? 5 : 3))
      .attr("stroke-linecap", "butt")
      .attr("fill", "none");

    // Needle.
    if (!small) {
      // gaugeChart
      //   .append("g")
      //   .append("path")
      //   .attr(
      //     "d",
      //     scales.lineRadial([
      //       [scales.needleScale(needleValue), radii.inner - 120],
      //       [scales.needleScale(needleValue), radii.inner - 10],
      //     ])
      //   )
      //   .attr("stroke", darkMode ? "#666666" : "#afafaf")
      //   .attr("stroke-width", 5)
      //   .attr("stroke-linecap", "round")
      //   .attr("fill", "none")
      //   .attr("class", "tick-needle");
    }

    // Use a triangle to indicate the current value.
    const triangle = d3.symbol().type(d3.symbolTriangle).size(100);

    gaugeChart
      .append("g")
      .attr("class", "needle-triangle")
      .selectAll("path")
      .data([needleValue])
      .enter()
      .append("path")
      .attr("d", triangle)
      .attr("fill", needle_color)
      .attr("stroke", "none")
      .attr("stroke-width", 1)
      .attr("stroke-linecap", "round")
      .attr("transform", (d) => {
        return `rotate(${scales.needleScale(d) * deg}),
            translate(${0}, ${-radii.inner + 15})`;
      });

    const textWrap = gaugeChart.append("g").attr("class", "gauge-text");

    // Current value as text.
    const currentValue = windDirAsOridnal
      ? ordinalCompass[Math.floor(current / 22.5 + 0.5) % 16]
      : current.toFixed(props.rounding) + he.decode(props.unit);
    const currentValueTextNode = textWrap
      .append("text")
      .text(currentValue)
      .attr("text-anchor", "middle")
      .attr("dx", 0)
      .attr("dy", "-0.95em")
      .attr("font-size", small ? "2em" : "2.5em")
      .attr("font-weight", "bold")
      .attr("alignment-baseline", "middle");

    if (windDirAsOridnal) {
      currentValueTextNode
        .append("tspan")
        .text(` / ${current.toFixed(props.rounding)}${he.decode(props.unit)}`)
        .attr("text-anchor", "middle")
        .attr("font-size", small ? "0.5em" : "0.5em")
        .attr("font-weight", "bold")
        .attr("alignment-baseline", "middle");
    }

    if (parseInt(props.properties.show_min_max)) {
      const legendMin = textWrap
        .append("g")
        .attr("class", "gauge-legend-min")
        .attr("transform", `translate(${-125}, ${0})`);

      const legendMinX = -25;

      legendMin
        .append("polygon")
        .attr("transform", `translate(${-30}, ${legendMinX})`)
        .attr("fill", darkMode ? "#f4f4f4" : "#afafaf")
        .attr("points", "16,28 9,21 10.4,19.6 16,25.2 21.6,19.6 23,21 ");

      legendMin
        .append("text")
        .text(
          windDirAsOridnal
            ? ordinalCompass[Math.floor(min / 22.5 + 0.5) % 16]
            : min.toFixed(props.rounding) + he.decode(props.unit)
        )
        .attr("alignment-baseline", "middle")
        .attr("transform", `translate(${0}, ${0})`)
        .attr("font-size", small ? "1em" : "1.25em");

      const legendMax = textWrap
        .append("g")
        .attr("class", "gauge-legend-max")
        .attr("transform", `translate(${35}, ${0})`);

      legendMax
        .append("polygon")
        .attr("transform", `translate(${0}, ${-10})`)
        .attr("fill", darkMode ? "#f4f4f4" : "#afafaf")
        .attr("points", "16,4 9,11 10.4,12.4 16,6.8 21.6,12.4 23,11 ");

      legendMax
        .append("text")
        .text(
          windDirAsOridnal
            ? ordinalCompass[Math.floor(max / 22.5 + 0.5) % 16]
            : max.toFixed(props.rounding) + he.decode(props.unit)
        )
        .attr("transform", `translate(${30}, ${0})`)
        .attr("alignment-baseline", "middle")
        .attr("font-size", small ? "1em" : "1.25em");

      // Center legends.
      const legendMinDimensions = legendMin.node()!.getBBox(),
        legendMaxDimensions = legendMax.node()!.getBBox();

      const legendWidth = legendMinDimensions.width + legendMaxDimensions.width;

      // // Reduce width (margin) for small gauges.
      // if (small) {
      //   legendWidth = legendWidth - 25;
      // }

      if (small) {
        // Legends centered on top of each other.
        legendMin
          .attr(
            "transform",
            `translate(${-legendMinDimensions.width / 2 + 23}, ${30})`
          )
          .attr("width", legendMinDimensions.width);

        legendMax
          .attr(
            "transform",
            `translate(${-legendMaxDimensions.width / 2 - 7}, ${5})`
          )
          .attr("width", legendMaxDimensions.width);
      } else {
        // Legends centered side by side.
        legendMin
          .attr("transform", `translate(${-legendWidth / 2 + 5}, ${0})`)
          .attr("width", legendMinDimensions.width);

        legendMax
          .attr(
            "transform",
            `translate(${
              legendWidth / 2 - legendMaxDimensions.width + 5
            }, ${0})`
          )
          .attr("width", legendMaxDimensions.width);
      }
    } else {
      textWrap.attr("transform", `translate(${0}, ${30})`);
    }

    // Observation label, eg. Outside Temperature.
    textWrap
      .append("text")
      .text(props.label)
      .attr("class", "gauge-label")
      .attr("width", 350)
      .attr("text-anchor", "middle")
      .attr("font-size", small ? "1.15em" : "1.25em")
      .attr("font-weight", "bold")
      .attr("dy", small ? "-3.75em" : "-4.25em")
      .attr("alignment-baseline", "middle");

    // Optimize text display.
    if (arc >= 1.97) {
      const textWrapDimensions = textWrap.node()!.getBBox();

      let translateY = textWrapDimensions.height / 2;

      if (!parseInt(props.properties.show_min_max)) {
        translateY = textWrapDimensions.height / 2 + 30;
      }

      textWrap.attr(
        "transform",
        `translate(${0}, ${translateY}), scale(${1.25})`
      );
    }
    if (arc < 1.97 && small) {
      const textWrapDimensions = textWrap.node()!.getBBox();
      textWrap.attr(
        "transform",
        `translate(${0}, ${textWrapDimensions.height / 4})`
      );
    }

    // Set viewBox.
    const gaugeContainerDimensions = gaugeChart.node()!.getBBox();
    svgElement.attr("viewBox", [
      0,
      0,
      gaugeContainerDimensions.width + 2 * margin,
      gaugeContainerDimensions.height + 2 * margin,
    ]);
    gaugeChart.attr(
      "transform",
      `translate(${-gaugeContainerDimensions.x + margin}, ${
        -gaugeContainerDimensions.y + margin
      })`
    );
  }, [current, min, max, darkMode, dimensions]);

  return (
    <>
      <div style={{ height: "100%", position: "relative" }} ref={diagram}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          data-test="d3-gauge-svg"
          ref={svgRef}
          style={{ fontSize: arc >= 1.5 ? "20px" : "16px" }}
        />
      </div>
    </>
  );
};
