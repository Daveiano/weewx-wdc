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

type GaugeDiagramBaseProps = {
  current: number;
  min: number;
  max: number;
  unit: string;
  obs: string;
  rounding: number;
};

export const D3GaugeDiagram: FunctionComponent<GaugeDiagramBaseProps> = (
  props: GaugeDiagramBaseProps
): React.ReactElement => {
  const svgRef: RefObject<SVGSVGElement> = useRef(null);
  const diagram = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
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
      const parent = diagram.current.parentElement as HTMLElement;

      console.log(parent);

      setDimensions({
        width: diagram.current.clientWidth,
        height: diagram.current.clientHeight,
      });
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

    const mutationObserver = new MutationObserver(callback);
    mutationObserver.observe(document.documentElement, { attributes: true });
    return () => {
      mutationObserver.disconnect();
    };
  }, []);

  const pi = Math.PI,
    rad = pi / 180,
    deg = 180 / pi;

  console.log(props);
  console.log(dimensions);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) {
      return;
    }

    d3.select(svgRef.current).selectChildren().remove();

    const margin = 30,
      rotation = 0,
      thickness = 0.1,
      arc = 1.25,
      ticksNumber = 7,
      color_scheme = "interpolateRdYlBu",
      color_step = 120,
      tick_color = darkMode ? "#393939" : "#ffffff", //darkMode ? "#525252" : "#dddddd",
      needle_color = darkMode ? "#f4f4f4" : "#161616",
      needleValue = props.current,
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

    let gradient = [];

    // TODO: Configurable yScaleMin and yScaleMax, yScaleOffset.
    const scaleMax = Math.round(props.max + 25),
      scaleMin = Math.round(props.min - 25);

    console.log(scaleMin, scaleMax);

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
      return {
        label:
          (scaleMin + d * tick_pct).toFixed(1) +
          props.unit.replace("&#176;", "°"),
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

    // From scaleMin to actual needle value.
    scales.gaugeArcScale = d3
      .arc()
      .innerRadius(radii.inner + 1)
      .outerRadius(radii.base)
      .startAngle(angles.start_angle)
      .endAngle(angles.end_angle);

    const valueMinAngle = scales.needleScale(props.min),
      valueMaxAngle = scales.needleScale(props.max);

    // Set gradient, @see https://observablehq.com/@d3/color-schemes
    const c = d3[color_scheme], //d3.interpolateTurbo, //d3.interpolateGreys, //d3.scaleSequential(["blue", "red"]), //d3[color_scheme],
      samples = color_step,
      total_arc = valueMaxAngle - valueMinAngle,
      sub_arc_gradient = total_arc / samples;

    gradient = d3.range(samples).map(function (d) {
      const sub_color = d / (samples - 1),
        sub_start_angle = valueMinAngle + sub_arc_gradient * d,
        sub_end_angle = sub_start_angle + sub_arc_gradient;

      console.log(sub_color);

      return {
        fill: c(1 - sub_color),
        start: sub_start_angle,
        end: sub_end_angle,
      };
    });

    const svgElement = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("viewBox", [
        -margin * 2,
        arc >= 1 ? -margin : margin,
        dimensions.width + 4 * margin,
        dimensions.height * arc + 2 * margin,
      ]);

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

    gaugeChart
      .append("path")
      .attr("d", scales.gaugeArcScale as any)
      .attr("fill", darkMode ? "#666666" : "#afafaf");

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
      .attr("font-size", "15px")
      .text((d) => d.label);

    gaugeChart
      .append("g")
      .attr("class", "current-ticks")
      .selectAll("path")
      .data([
        {
          coordinates: [
            [scales.needleScale(props.min), radii.inner + 2],
            [scales.needleScale(props.min), radii.outer_tick - 6],
          ],
          label: "min",
          color: "#313695",
        },
        {
          coordinates: [
            [scales.needleScale(props.max), radii.inner + 2],
            [scales.needleScale(props.max), radii.outer_tick - 6],
          ],
          label: "max",
          color: "#a50026",
        },
        {
          coordinates: [
            [scales.needleScale(needleValue), radii.inner + 2],
            [scales.needleScale(needleValue), radii.outer_tick - 6],
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
      .attr("stroke-width", (d: any) => (d.label === "current" ? 6 : 4))
      .attr("stroke-linecap", "round")
      .attr("fill", "none");

    // gaugeChart
    //   .append("g")
    //   .attr("class", "needle")
    //   .selectAll("path")
    //   .data([needleValue])
    //   .enter()
    //   .append("path")
    //   .attr("d", (d) =>
    //     scales.lineRadial([
    //       [0, 0],
    //       [scales.needleScale(d), radii.outer_tick],
    //     ])
    //   )
    //   .attr("stroke", needle_color)
    //   .attr("stroke-width", 10)
    //   .attr("stroke-linecap", "round");

    // gaugeChart
    //   .select("g.needle")
    //   .append("circle")
    //   .attr("cx", 0)
    //   .attr("cy", 0)
    //   .attr("r", radii.cap / 2)
    //   //.attr("stroke", needle_color)
    //   //.attr("stroke-width", 6)
    //   .style("fill", needle_color);

    gaugeChart
      .append("text")
      .text(
        props.current.toFixed(props.rounding) +
          props.unit.replace("&#176;", "°")
      )
      .attr("text-anchor", "middle")
      .attr("dx", 0)
      .attr("dy", -30)
      .attr("font-size", "2.5rem")
      .attr("font-weight", "bold")
      .attr("alignment-baseline", "middle");

    const legendMin = gaugeChart
      .append("g")
      .attr("class", "gauge-legend-min")
      .attr("dx", -10)
      .attr("dy", -10)
      .attr("transform", `translate(${-10}, ${30})`);

    legendMin
      .append("text")
      .text(
        props.min.toFixed(props.rounding) + props.unit.replace("&#176;", "°")
      )
      .attr("text-anchor", "end")
      .attr("font-size", "1.25rem")
      .attr("alignment-baseline", "middle");

    const chevronDown = legendMin
      .append("polygon")
      .attr("fill", darkMode ? "#f4f4f4" : "#afafaf")
      .attr("points", "16,28 9,21 10.4,19.6 16,25.2 21.6,19.6 23,21 ");

    chevronDown
      .append("rect")
      .attr("id", "_Transparent_Rectangle_")
      .attr("class", "st0")
      .attr("width", "32")
      .attr("height", "32");

    gaugeChart
      .append("text")
      .text(
        `Max: ${props.max.toFixed(props.rounding)}${props.unit.replace(
          "&#176;",
          "°"
        )}`
      )
      .attr("text-anchor", "start")
      .attr("dx", 10)
      .attr("dy", -10)
      .attr("font-size", "1.25rem")
      .attr("alignment-baseline", "middle")
      .attr("transform", `translate(${-10}, ${30})`);
  }, [props.current, props.min, props.max, darkMode, dimensions]);

  return (
    <>
      <div style={{ height: "100%", position: "relative" }} ref={diagram}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          data-test="d3-gauge-svg"
          ref={svgRef}
        />
      </div>
    </>
  );
};
