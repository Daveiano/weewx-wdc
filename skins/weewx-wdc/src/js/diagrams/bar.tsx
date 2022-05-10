import React, { FunctionComponent } from "react";
import { ResponsiveBar } from "@nivo/bar";
import moment from "moment";

import { DiagramBaseProps } from "./types";
import { getyScaleOffset } from "../util/util";
import { TooltipBar } from "../components/tooltip-bar";

export const BarDiagram: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  console.log(props);

  return (
    <div style={{ height: "400px" }}>
      <ResponsiveBar
        axisBottom={{
          format: (value) => moment.unix(value).format("HH:mm"),
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
        }}
        axisLeft={{
          legend: props.unit,
          legendOffset: -35,
          legendPosition: "middle",
          tickSize: 0,
          tickPadding: 10,
        }}
        colors={props.color}
        data={props.data[0].data}
        enableLabel={false}
        enableGridX={false}
        enableGridY={true}
        indexBy="x"
        indexScale={{ type: "band", round: false }}
        isInteractive={true}
        labelSkipHeight={50}
        margin={{ top: 20, right: 10, bottom: 20, left: 40 }}
        maxValue={
          Math.max(...props.data[0].data.map((item): number => item.y)) +
          getyScaleOffset(props.observation)
        }
        minValue={0}
        keys={["y"]}
        tooltip={(point) => (
          <TooltipBar
            formattedValue={point.formattedValue}
            color={props.color[0]}
            time={moment.unix(point.data.x).format("HH:mm")}
          />
        )}
        valueFormat={(value) => `${value} ${props.unit}`}
        valueScale={{ type: "linear" }}
      />
    </div>
  );
};
