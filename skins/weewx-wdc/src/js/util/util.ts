import { ScaleSpec } from "@nivo/scales";
import { Box } from "@nivo/core";

export const enableArea: string[] = [
  "humidity",
  "pressure",
  "wind",
  "windDir",
  "radiation",
  "UV",
  "cloudbase",
];

export const areaBaselineValue0: string[] = [
  "humidity",
  "windDir",
  "radiation",
  "UV",
  "cloudbase",
];

export const getyScaleOffset = (obs: string): number => {
  let offset = 3;

  if (obs === "humidity") {
    offset = 10;
  }

  if (obs === "radiation") {
    offset = 25;
  }

  if (obs === "cloudbase") {
    offset = 300;
  }

  if (obs === "UV") {
    offset = 1;
  }

  if (obs === "ET") {
    offset = 0.02;
  }

  if (obs === "rain") {
    offset = 1;
  }

  return offset;
};

export const getyScale = (obs: string, data: any[]): ScaleSpec => {
  let staticMin: "auto" | number | undefined = undefined;
  let staticMax: "auto" | number | undefined = undefined;

  if (obs === "humidity") {
    staticMin = 0;
    staticMax = 103;
  }

  if (obs === "windDir") {
    staticMin = 0;
    staticMax = 360;
  }

  if (obs === "radiation") {
    staticMin = "auto";
  }

  if (obs === "cloudbase" || obs === "UV" || obs === "rainRate") {
    staticMin = 0;
  }

  return {
    type: "linear",
    min:
      typeof staticMin === "number" || typeof staticMin === "string"
        ? staticMin
        : Math.min(...data.map((item) => item.y)) - getyScaleOffset(obs),
    max:
      typeof staticMax === "number" || typeof staticMax === "string"
        ? staticMax
        : Math.max(...data.map((item) => item.y)) + getyScaleOffset(obs),
  };
};

export const getCurve = (obs: string) => {
  switch (obs) {
    case "windDir":
    case "radiation":
      return "basis";
    case "UV":
      return "step";
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

  if (obs === "pressure" || obs == "cloudbase") {
    margin.left = 48;
  }

  if (obs === "radiation") {
    margin.left = 45;
  }

  return margin;
};

export const getAxisLeftLegendOffset = (obs: string): number => {
  switch (obs) {
    case "pressure":
    case "cloudbase":
      return -43;
    case "radiation":
      return -40;
    default:
      return -35;
  }
};
