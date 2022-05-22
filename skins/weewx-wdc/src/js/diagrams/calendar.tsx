import React, { FunctionComponent } from "react";
import { ResponsiveCalendar } from "@nivo/calendar";
import moment from "moment";
import { NumberValue, scaleQuantize } from "d3-scale";

import { ColorScale } from "@nivo/calendar";

import { CalendarDiagramBaseProps } from "./types";
import { TooltipCalendar } from "../components/tooltip-calendar";

export const CalendarDiagram: FunctionComponent<CalendarDiagramBaseProps> = (
  props: CalendarDiagramBaseProps
): React.ReactElement => {
  const start = props.data[0].day;
  const end = props.data[props.data.length - 1].day;
  const yearDiff = moment(end).diff(start, "years");

  // @see https://nivo.rocks/storybook/?path=/story/calendarcanvas--custom-color-space-function
  const color = (): ColorScale => {
    const defaultColorScale = scaleQuantize<string>()
      .domain([0, Math.max(...props.data.map((item) => item.value))])
      .range(props.color);
    const colorScale = (value: NumberValue) => {
      return defaultColorScale(value); //adding alpha channel
    };
    colorScale.ticks = (count: number | undefined) => {
      return defaultColorScale.ticks(count);
    };
    return colorScale;
  };

  return (
    <>
      <p className="label">{props.heading}</p>
      <div
        className="calendar-diagram"
        // @todo Add responsive style.
        style={{ height: `${(yearDiff + 1) * 15}vw` }}
      >
        <ResponsiveCalendar
          from={props.data[0].day}
          data={props.data}
          to={props.data[props.data.length - 1].day}
          emptyColor="#e0e0e0"
          //colors={props.color}
          colorScale={color()}
          margin={{ top: 40, right: 20, bottom: 40, left: 25 }}
          dayBorderColor="#ffffff"
          monthSpacing={2}
          monthBorderColor="#ffffff"
          monthLegendOffset={14}
          monthLegendPosition="after"
          yearSpacing={30}
          yearLegendOffset={10}
          tooltip={(data) => (
            <TooltipCalendar
              day={data.day}
              value={data.value}
              unit={props.unit}
              color={props.color[0]}
            />
          )}
        />
      </div>
    </>
  );
};
