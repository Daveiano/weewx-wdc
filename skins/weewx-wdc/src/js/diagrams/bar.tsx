import React, { FunctionComponent } from "react";
import { ResponsiveBar } from "@nivo/bar";
import moment from "moment";

import { DiagramBaseProps } from "./types";
import { getyScaleOffset } from "../util/util";
import { TooltipBar } from "../components/tooltip-bar";

export const BarDiagram: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  let dateFormat = "HH:mm";

  switch (props.precision) {
    case "week":
      dateFormat = "DD.MM";
      break;
    case "month":
      dateFormat = "DD.MM";
      break;
    case "year":
    case "alltime":
      dateFormat = "DD.MM";
      break;
  }

  return (
    <div className="diagram">
      <ResponsiveBar
        axisBottom={{
          format: (value) => moment.unix(value).format(dateFormat),
          tickSize: props.precision === "day" ? 2 : 0,
          tickPadding: 5,
          tickRotation: -65,
        }}
        axisLeft={{
          legend: props.unit,
          legendOffset: -50,
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
        margin={{
          top: 20,
          right: 10,
          bottom: 40,
          left: 55,
        }}
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
            time={moment.unix(point.data.x).format(dateFormat)}
          />
        )}
        valueFormat={(value) => `${value} ${props.unit}`}
        valueScale={{ type: "linear" }}
      />
    </div>
  );
};
