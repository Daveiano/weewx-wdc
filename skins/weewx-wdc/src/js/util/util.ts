import { Scale, ScaleLinearSpec } from "@nivo/scales";
import { Box } from "@nivo/core";
import { Series } from "../diagrams/types";
import dayjs from "dayjs";

export const getyScale = (
  data: Series[],
  yScaleOffset: string,
  yScaleMin?: string,
  yScaleMax?: string
): ScaleLinearSpec => {
  let staticMin: "auto" | number | undefined = undefined;
  let staticMax: "auto" | number | undefined = undefined;

  if (yScaleMin) {
    staticMin = yScaleMin === "auto" ? yScaleMin : parseFloat(yScaleMin);
  }
  if (yScaleMax) {
    staticMax = yScaleMax === "auto" ? yScaleMax : parseFloat(yScaleMax);
  }

  return {
    type: "linear",
    min:
      typeof staticMin === "number" || typeof staticMin === "string"
        ? staticMin
        : Math.min(...data.map((item) => item.y)) - parseFloat(yScaleOffset),
    max:
      typeof staticMax === "number" || typeof staticMax === "string"
        ? staticMax
        : Math.max(...data.map((item) => item.y)) + parseFloat(yScaleOffset),
  };
};

export const getCurve = (obs: string) => {
  switch (obs) {
    case "windDir":
    case "radiation":
      return "basis"; // basis
    case "UV":
      return "step";
    case "rainRate":
    case "wind":
      return "linear";
    default:
      return "natural";
  }
};

export const getMargins = (obs: string): Box => {
  const margin = {
    top: 20,
    right: 10,
    bottom: 20,
    left: 40,
  };

  if (obs == "cloudbase" || obs == "rainRate") {
    margin.left = 50;
  }

  if (obs === "pressure") {
    margin.left = 55;
  }

  if (obs === "radiation") {
    margin.left = 45;
  }

  return margin;
};

export const getAxisLeftLegendOffset = (obs: string): number => {
  switch (obs) {
    case "pressure":
      return -50;
    case "cloudbase":
    case "rainRate":
      return -45;
    case "radiation":
      return -40;
    default:
      return -35;
  }
};

export const getTimeDifferenceInMonths = (data: string | any[]): number => {
  const firstDate = dayjs.unix(data[0].x),
    lastDate = dayjs.unix(data[data.length - 1].x);

  let diff = (lastDate.year() - firstDate.year()) * 12;

  diff -= firstDate.month();
  diff += lastDate.month() + 1;

  return diff;
};
