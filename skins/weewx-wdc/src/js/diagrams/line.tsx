import React, { FunctionComponent } from "react";
import { ResponsiveLine } from "@nivo/line";

import { DiagramBaseProps } from "./types";
import { TooltipLine } from "../components/tooltip-line";
import { getyScaleOffset, enableArea, getyScale, getCurve } from "../util/util";
import { sliceTooltip } from "../components/tooltip-slice";

export const LineDiagram: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  console.log(props);

  let combinedData: any[] = [];
  if (props.data.length > 1) {
    for (const serie of props.data) {
      combinedData = [...combinedData, ...serie.data];
    }
  } else {
    combinedData = props.data[0].data;
  }

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
        // @todo Does only work with °C.
        legend: `0 ${props.unit}`,
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
          legendOffset: props.observation === "pressure" ? -43 : -35,
          legendPosition: "middle",
          tickSize: 0,
          tickPadding: 10,
        }}
        colors={props.color}
        curve={getCurve(props.observation)}
        data={props.data}
        enableArea={enableArea.includes(props.observation)}
        areaOpacity={props.observation === "wind" ? 0.5 : 0.07}
        areaBaselineValue={
          props.observation === "humidity" || props.observation === "windDir"
            ? 0
            : Math.min(...combinedData.map((item) => item.y)) -
              getyScaleOffset(props.observation)
        }
        enableCrosshair={true}
        enablePoints={true}
        enableSlices={props.data.length > 1 ? "x" : false}
        sliceTooltip={(slice) => sliceTooltip(slice)}
        isInteractive={true}
        legends={
          props.data.length > 1
            ? [
                {
                  anchor: "top-right",
                  direction: "row",
                  itemWidth: 120,
                  itemHeight: 20,
                  itemsSpacing: 10,
                },
              ]
            : undefined
        }
        lineWidth={2}
        margin={{
          top: 20,
          right: 10,
          bottom: 20,
          left: props.observation === "pressure" ? 48 : 40,
        }}
        markers={markers}
        pointSize={5}
        tooltip={(point) => <TooltipLine point={point.point} />}
        useMesh={true}
        xScale={{
          precision: "minute",
          type: "time",
          format: "%s",
        }}
        yScale={getyScale(props.observation, combinedData)}
        xFormat="time:%Y/%m/%d %H:%M"
        yFormat={(value) => `${value} ${props.unit}`}
      />
    </div>
  );
};
