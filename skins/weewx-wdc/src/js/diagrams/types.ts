import type { Serie } from "@nivo/line";

type context = "day" | "week" | "month" | "year" | "alltime";

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
  context: context;
  nivoProps: {
    lineWidth?: number;
    pointSize?: number;
    isInteractive?: boolean;
    enablePoints?: boolean;
    enableLabel?: boolean;
    enableCrosshair?: boolean;
    yScaleOffset: string;
    yScaleMin?: string;
    yScaleMax?: string;
  };
};

type WindRoseProps = {
  data: any[];
};

interface Series {
  x: number;
  y: number;
}

export {
  CalendarDiagramBaseProps,
  DiagramBaseProps,
  context,
  Series,
  WindRoseProps,
};
