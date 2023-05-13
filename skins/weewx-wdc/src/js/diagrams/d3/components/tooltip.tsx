import React from "react";
import * as d3 from "d3";

import { context, TooltipProps } from "../../types";

export const Tooltip = (
  props: TooltipProps & { context: context }
): React.ReactElement => {
  if (props.tooltips.length === 0) {
    return <></>;
  }

  const dateTimeFormat = d3.timeFormat(props.dateTimeFormat);

  if (props.tooltips.length === 1) {
    return (
      <div
        style={{
          padding: "7px",
          color: "white",
          borderLeft: `5px solid ${props.color[0]}`,
          textAlign: "right",
        }}
        className="diagram-tooltip"
      >
        <div style={{ marginBottom: "5px", whiteSpace: "nowrap" }}>
          {dateTimeFormat(new Date(props.tooltips[0].x * 1000))}
        </div>
        <div>
          {props.tooltips[0].y} {props.unit[0]}
        </div>
      </div>
    );
  }

  return (
    <div className="diagram-tooltip">
      <header
        style={{
          textAlign: "right",
          color: "white",
          padding: "7px 7px 14px 20px",
          fontSize: "1.2em",
          whiteSpace: "nowrap",
        }}
      >
        {dateTimeFormat(new Date(props.tooltips[0].x * 1000))}
      </header>
      {props.tooltips.map((item, index) => (
        <div
          key={index}
          style={{
            padding: "7px",
            color: "white",
            borderLeft: `5px solid ${props.color[index]}`,
            textAlign: "right",
          }}
          className="diagram-tooltip"
        >
          <div>
            {item.y} {props.unit[index]}
          </div>
        </div>
      ))}
    </div>
  );
};
