import { Margin } from "@nivo/core";
import dayjs from "dayjs";
import { useState, useEffect, RefObject } from "react";

import * as d3 from "d3";
import color from "color";
import { context, DiagramBaseProps } from "../diagrams/types";

export interface Size {
  width: number | undefined;
  height: number | undefined;
}

export const useWindowSize = (): Size => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<Size>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
};

// @see https://dev.to/jmalvarez/check-if-an-element-is-visible-with-react-hooks-27h8
export const useIsVisible = (ref: RefObject<SVGSVGElement>): boolean => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current as Element);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
};

// TODO: Somehow get width of axis.
export const getMargins = (obs: string): Margin => {
  // These are nivo margin, not d3!
  const margin = {
    top: 20,
    right: 10,
    bottom: 20,
    left: 40,
  };

  if (obs == "cloudbase" || obs == "rainRate") {
    margin.left = 50;
  }

  if (
    obs === "pressure" ||
    obs === "altimeter" ||
    obs === "barometer" ||
    obs === "rain" ||
    obs === "ET" ||
    obs.includes("Voltage")
  ) {
    margin.left = 55;
  }

  // cmon
  if (obs === "mem_used") {
    margin.left = 70;
  }
  if (obs === "cpu_user" || obs === "cpu_system" || obs === "cpu_idle") {
    margin.left = 60;
  }
  if (obs === "radiation") {
    margin.left = 45;
  }
  if (obs.includes("net_eth0") || obs.includes("net_wlan0")) {
    margin.left = 65;
  }

  return margin;
};

export const getAxisLeftLegendOffset = (obs: string): number => {
  const margins = getMargins(obs);

  return (margins.left - 5) * -1;
};

export const getTimeDifferenceInMonths = (data: string | any[]): number => {
  const firstDate = dayjs.unix(data[0].x),
    lastDate = dayjs.unix(data[data.length - 1].x);

  let diff = (lastDate.year() - firstDate.year()) * 12;

  diff -= firstDate.month();
  diff += lastDate.month() + 1;

  return diff;
};

export const truncate = (str: string, n: number): string => {
  return str.length > n ? str.slice(0, n - 1) + "\u2026" : str;
};

export const getAxisGridColor = (darkMode: boolean): string =>
  darkMode ? "#525252" : "#dddddd";

export const getBackgroundColorDarkModeLightness = color("#393939").lightness();

export const chartTransition = "left 0.25s ease-in-out, top 0.35s ease-in-out";

export const getObsPropsFromChartProps = (
  chartProps: DiagramBaseProps["nivoProps"],
  observation: string
): DiagramBaseProps["nivoProps"] => {
  const observationProps = chartProps.obs
    ? {
        ...chartProps,
        ...Object.entries(chartProps.obs).filter(
          ([key, value]) => value.observation === observation
        )[0][1],
      }
    : chartProps;

  return observationProps;
};

export const getColors = (
  darkMode: boolean,
  chartProps: DiagramBaseProps["nivoProps"],
  colors: string[],
  observations: string[]
): string[] => {
  if (!darkMode) {
    return colors;
  }

  return colors.map((c, index) => {
    const observationProps = getObsPropsFromChartProps(
      chartProps,
      observations[index]
    );

    if (observationProps.color_dark) {
      return observationProps.color_dark;
    }

    if (chartProps.enableArea) {
      return color(c).lightness() <= getBackgroundColorDarkModeLightness * 2
        ? color(c).desaturate(0.1).lighten(0.75).hex()
        : c;
    } else {
      if (color(c).red() > 90) {
        return color(c).desaturate(0.5).lighten(1.5).hex();
      }
      if (color(c).lightness() <= getBackgroundColorDarkModeLightness) {
        return color(c).lighten(10).hex();
      }

      return color(c).lighten(0.25).hex();
    }
  });
};

export const getCurve = (curveType: string): d3.CurveFactory => {
  let curve = d3.curveNatural;
  switch (curveType) {
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
  return curve;
};
