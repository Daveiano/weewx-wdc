import type { Serie } from "@nivo/line";

type precision = "day" | "week" | "month" | "year" | "alltime";

type DiagramBaseProps = {
  color: string[];
  unit?: string;
  data: Serie[];
  observation: string;
  precision: precision;
};

interface Series {
  x: number;
  y: number;
}

export { DiagramBaseProps, precision, Series };
