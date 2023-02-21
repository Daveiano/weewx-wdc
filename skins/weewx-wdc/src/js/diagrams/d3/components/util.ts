import * as d3 from "d3";
import color from "color";
import { context } from "../../types";
import dayjs from "dayjs";

export const getAxisGridColor = (darkMode: boolean): string =>
  darkMode ? "#525252" : "#dddddd";

export const getBackgroundColorDarkModeLightness = color("#393939").lightness();

export const chartTransition = "left 0.25s ease-in-out, top 0.35s ease-in-out";

export const getColors = (
  darkMode: boolean,
  enableArea: boolean,
  colors: string[]
): string[] => {
  return darkMode
    ? enableArea
      ? colors.map((c) =>
          color(c).lightness() <= getBackgroundColorDarkModeLightness * 2
            ? color(c).desaturate(0.1).lighten(0.75).hex()
            : c
        )
      : colors.map((c) => {
          if (color(c).red() > 90) {
            return color(c).desaturate(0.5).lighten(1.5).hex();
          }
          if (color(c).lightness() <= getBackgroundColorDarkModeLightness) {
            return color(c).lighten(10).hex();
          }

          return color(c).lighten(0.25).hex();
        })
    : colors;
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

export const getDateFormattedChart = (
  date: number,
  context: context
): string => {
  let format = "%H:%M";

  switch (context) {
    case "week":
      format = "DD.MM";
      break;
    case "month":
      format = "DD.MM";
      break;
    case "year":
      format = "DD.MM";
      break;
    case "alltime":
      format = "DD.MM.YYYY";
      break;
  }

  return dayjs.unix(date).format(format);
};

export const getDateFormattedTooltip = (
  date: number,
  context: context
): string => {
  let format = "YYYY/MM/DD HH:mm";

  switch (context) {
    case "week":
      format = "YYYY/MM/DD HH:mm";
      break;
    case "month":
      format = "YYYY/MM/DD HH:mm";
      break;
    case "year":
      format = "YYYY/MM/DD";
      break;
    case "alltime":
      format = "YYYY/MM/DD";
      break;
  }

  return dayjs.unix(date).format(format);
};
