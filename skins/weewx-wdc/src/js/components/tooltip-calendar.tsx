import dayjs from "dayjs";
import React from "react";

interface TooltipPropsCalendar {
  day: string;
  value: string;
  unit: string;
  color: string;
  locale: d3.TimeLocaleObject;
}

export const TooltipCalendar: React.FC<TooltipPropsCalendar> = (
  props: TooltipPropsCalendar
): React.ReactElement => {
  // Locale handling.
  const dateTimeFormat = props.locale.format("%x");

  console.log(props);

  return (
    <div
      style={{
        padding: "7px",
        color: "white",
        borderLeft: `5px solid ${props.color}`,
        textAlign: "right",
      }}
      className="diagram-tooltip"
    >
      <div style={{ marginBottom: "5px", lineHeight: "1.25em" }}>
        {dateTimeFormat(dayjs(props.day).toDate())}
      </div>
      <div>
        {props.value} {props.unit}
      </div>
    </div>
  );
};
