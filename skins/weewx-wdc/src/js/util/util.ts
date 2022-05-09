import { ScaleSpec } from "@nivo/scales";

export const enableArea: string[] = ["humidity", "pressure", "wind", "windDir"];

export const getyScaleOffset = (obs: string): number => {
  let offset = 3;

  if (obs === "humidity") {
    offset = 10;
  }

  return offset;
};

export const getyScale = (obs: string, data: any[]): ScaleSpec => {
  let staticMin: number | boolean = false;
  let staticMax: number | boolean = false;

  if (obs === "humidity") {
    staticMin = 0;
    staticMax = 103;
  }

  if (obs === "windDir") {
    staticMin = 0;
    staticMax = 360;
  }

  return {
    type: "linear",
    min:
      typeof staticMin === "number"
        ? staticMin
        : Math.min(...data.map((item) => item.y)) - getyScaleOffset(obs),
    max:
      typeof staticMax === "number"
        ? staticMax
        : Math.max(...data.map((item) => item.y)) + getyScaleOffset(obs),
  };
};

export const getCurve = (obs: string) => {
  switch (obs) {
    case "windDir":
      return "basis";
    default:
      return "natural";
  }
};
