import type { Serie } from "@nivo/line";

type precision = "day" | "week" | "month" | "year" | "alltime";

type CalendarDiagramBaseProps = {
  color: string[];
  unit: string;
  data: Array<{ day: string; value: number }>;
  observation: string;
  heading: string;
};

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

export { CalendarDiagramBaseProps, DiagramBaseProps, precision, Series };
