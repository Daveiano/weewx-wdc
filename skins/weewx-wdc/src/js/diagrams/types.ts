interface Datum {
  x: number;
  y: number;
  end: number;
  [key: string]: number;
}

interface Serie {
  observation: string;
  id: string | number;
  data: Datum[];
  [key: string]: any;
}

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
  unit: string | string[];
  data: Serie[];
  observation: string;
  context: context;
  nivoProps: {
    areaOpacity?: number;
    lineWidth?: number;
    pointSize?: number;
    isInteractive?: boolean;
    enableArea: boolean;
    enablePoints?: boolean;
    enableLabel?: boolean;
    enableCrosshair?: boolean;
    markerColor?: string;
    markerLabel?: string;
    markerValue?: number;
    yScaleOffset: string;
    yScaleMin?: string;
    yScaleMax?: string;
    curve:
      | "basis"
      | "cardinal"
      | "catmullRom"
      | "linear"
      | "monotoneX"
      | "monotoneY"
      | "natural"
      | "step"
      | "stepAfter"
      | "stepBefore";
    color_dark?: string;
    bottom_date_time_format: string;
    tooltip_date_time_format: string;
    obs?: {
      [key: string]: any;
    };
  };
};

type TooltipProps = {
  tooltips: Datum[];
  color: string[];
  unit: string[];
  dateTimeFormat: string;
};

type WindRoseProps = {
  data: any[];
};

// @todo What is this?
interface Series {
  x: number;
  y: number;
}

export {
  CalendarDiagramBaseProps,
  DiagramBaseProps,
  context,
  Datum,
  Serie,
  Series,
  TooltipProps,
  WindRoseProps,
};
