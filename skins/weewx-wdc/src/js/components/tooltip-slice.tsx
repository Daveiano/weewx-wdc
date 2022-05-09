import React from "react";
import { SliceTooltipProps } from "@nivo/line";

import { TooltipLine } from "./tooltip-line";

export const sliceTooltip = (props: SliceTooltipProps): React.ReactElement => {
  const tooltips = props.slice.points.map((item, index) => (
    <TooltipLine slice={true} key={index} point={item} />
  ));

  return (
    <div
      style={{
        background: "rgb(57 57 57)",
        boxShadow: `0 2px 6px rgb(57 57 57)`,
      }}
      className="diagram-tooltip"
    >
      <header
        style={{
          textAlign: "right",
          color: "white",
          padding: "7px 7px 14px 20px",
          fontSize: "1.2em",
        }}
      >
        {props.slice.points[0].data.xFormatted}
      </header>
      {tooltips}
    </div>
  );
};
