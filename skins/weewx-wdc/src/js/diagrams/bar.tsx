import React, { FunctionComponent } from "react";
import { ResponsiveBar } from "@nivo/bar";
import moment from "moment";
import { useMediaQuery } from "@react-hook/media-query";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import { DiagramBaseProps } from "./types";
import { getyScaleOffset } from "../util/util";
import { TooltipBar } from "../components/tooltip-bar";
import { Maximize } from "../assets/maximize";

export const BarDiagram: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  const small = useMediaQuery("(max-width: 672px)");
  const handle = useFullScreenHandle();
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

  console.log(props.nivoProps);
  console.log({ enableLabel: false, isInteractive: true });

  const barDiagram = (
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
      labelSkipHeight={35}
      margin={{
        top: 20,
        right: 10,
        bottom: 40,
        left: 55,
      }}
      maxValue={
        Math.max(
          ...props.data[0].data.map((item): number => (item as { y: number }).y)
        ) + getyScaleOffset(props.observation)
      }
      minValue={0}
      keys={["y"]}
      tooltip={(point) => (
        <TooltipBar
          formattedValue={point.formattedValue}
          color={props.color[0]}
          time={moment
            .unix((point as { data: { x: number } }).data.x)
            .format(dateFormat)}
          endTime={moment.unix(point.data.end).format(dateFormat)}
        />
      )}
      valueFormat={(value) => `${value} ${props.unit}`}
      valueScale={{ type: "linear" }}
      theme={{
        fontSize: small ? 9 : 11,
      }}
      {...props.nivoProps}
    />
  );

  return (
    <>
      <Maximize onClick={handle.enter} />
      <div className="diagram">{barDiagram}</div>
      <FullScreen handle={handle}>
        <Maximize onClick={handle.exit} />
        {barDiagram}
      </FullScreen>
    </>
  );
};
