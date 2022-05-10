import type { Serie } from "@nivo/line";

type DiagramBaseProps = {
  color: string[];
  unit?: string;
  data: Serie[];
  observation: string;
  precision: "day" | "week" | "month" | "year";
};

export { DiagramBaseProps };
