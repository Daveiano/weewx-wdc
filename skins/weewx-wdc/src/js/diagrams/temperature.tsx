import React, { FunctionComponent } from "react";
import { ResponsiveLine } from "@nivo/line";

import { DiagramBaseProps } from "./types";

export const TemperatureDiagram: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  console.log(
    props.series.map((item) => ({
      x: item[0],
      y: item[1],
    }))
  );
  return (
    <div style={{ height: "400px" }}>
      <ResponsiveLine
        data={[
          {
            id: "temperature",
            data: props.series.map((item) => ({
              x: item[0],
              y: item[1],
            })),
          },
        ]}
      />
    </div>
  );
};
