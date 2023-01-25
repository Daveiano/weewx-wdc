interface Datum {
  x: number;
  y: number;
  end: number;
  [key: string]: any;
}

interface Serie {
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
  unit?: string | [string];
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
  };
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
  WindRoseProps,
};
