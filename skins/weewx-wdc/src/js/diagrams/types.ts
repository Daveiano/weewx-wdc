import type { Serie } from "@nivo/line";

type DiagramBaseProps = {
  color: string[];
  unit?: string;
  data: Serie[];
  observation: string;
};

export { DiagramBaseProps };
