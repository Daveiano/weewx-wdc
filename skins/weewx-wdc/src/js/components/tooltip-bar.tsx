import React from "react";

interface TooltipPropsBar {
  formattedValue: string;
  time: string;
  endTime: string;
  color: string;
}

export const TooltipBar: React.FC<TooltipPropsBar> = (
  props: TooltipPropsBar
): React.ReactElement => {
  return (
    <div
      style={{
        padding: "7px",
        background: "rgb(57 57 57)",
        color: "white",
        boxShadow: `0 2px 6px rgb(57 57 57)`,
        borderLeft: `5px solid ${props.color}`,
        textAlign: "right",
      }}
      className="diagram-tooltip"
    >
      <div
        style={{ marginBottom: "5px", lineHeight: "1.25em" }}
        dangerouslySetInnerHTML={{ __html: `${props.time} - ${props.endTime}` }}
      />
      <div>{props.formattedValue}</div>
    </div>
  );
};
