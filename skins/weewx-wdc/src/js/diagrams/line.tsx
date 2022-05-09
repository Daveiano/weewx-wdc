import React, { FunctionComponent } from "react";
import { ResponsiveLine } from "@nivo/line";

import { DiagramBaseProps } from "./types";
import { TooltipLine } from "../components/tooltip-line";

export const LineDiagram: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  console.log(props);
  let markers: any[] | undefined = [];
  if (props.observation === "temp") {
    markers = [
      ...markers,
      {
        axis: "y",
        value: 0,
        lineStyle: {
          stroke: "#00BFFF",
          strokeWidth: 2,
          strokeOpacity: 0.75,
          strokeDasharray: "10, 10",
        },
        legend: "0 °C",
        legendOrientation: "horizontal",
      },
    ];
  }

  return (
    <div style={{ height: "400px" }}>
      <ResponsiveLine
        axisBottom={{
          format: "%H:%M",
          tickValues: "every 3 hours",
          tickSize: 0,
          tickPadding: 5,
        }}
        axisLeft={{
          legend: props.unit,
          legendOffset: -35,
          legendPosition: "middle",
          tickSize: 0,
          tickPadding: 10,
        }}
        colors={props.color}
        curve="natural"
        data={props.data}
        enableCrosshair={true}
        enablePoints={true}
        isInteractive={true}
        lineWidth={2}
        margin={{ top: 20, right: 10, bottom: 20, left: 40 }}
        markers={markers}
        pointSize={5}
        tooltip={(point) => <TooltipLine point={point.point} />}
        useMesh={true}
        xScale={{
          precision: "minute",
          type: "time",
          format: "%s",
        }}
        yScale={{
          type: "linear",
          min: Math.min(...props.data[0].data.map((item) => item.y)) - 3,
          max: Math.max(...props.data[0].data.map((item) => item.y)) + 3,
        }}
        xFormat="time:%Y/%m/%d %H:%M"
        yFormat={(value) => `${value} ${props.unit}`}
      />
    </div>
  );
};
