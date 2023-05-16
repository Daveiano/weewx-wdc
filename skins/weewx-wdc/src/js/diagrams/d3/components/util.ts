import * as d3 from "d3";
import color from "color";
import { context, DiagramBaseProps } from "../../types";

export const getAxisGridColor = (darkMode: boolean): string =>
  darkMode ? "#525252" : "#dddddd";

export const getBackgroundColorDarkModeLightness = color("#393939").lightness();

export const chartTransition = "left 0.25s ease-in-out, top 0.35s ease-in-out";

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
    // @todo Outsource.
    const observationProps = chartProps.obs
      ? {
          ...chartProps,
          ...Object.entries(chartProps.obs).filter(
            ([key, value]) => value.observation === observations[index]
          )[0][1],
        }
      : chartProps;

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
