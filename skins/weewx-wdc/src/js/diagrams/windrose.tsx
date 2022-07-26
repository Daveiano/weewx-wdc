import { PropTypes } from "carbon-components-react";
import React, { FunctionComponent, useRef, useState } from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import { TooltipWindrose } from "../components/tooltip-windrose";
import { WindRoseProps } from "./types";

const Plot = createPlotlyComponent((window as any).Plotly);
const colors = (window as any).weewxWdcConfig.windRoseColors;

export const WindRoseDiagram: FunctionComponent<WindRoseProps> = (
  props: WindRoseProps
): React.ReactElement => {
  const hoverInfoRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");
  const [template, setTemplate] = useState("");
  const [replacements, setReplacements] = useState({});

  return (
    <>
      <Plot
        data={props.data}
        layout={{
          hovermode: "closest",
          dragmode: false,
          font: { size: 12 },
          legend: {
            font: { size: 12 },
            xanchor: "left",
            //orientation: "v",
            x: -0.5,
            y: 0.5,
          },
          autosize: true,
          margin: {
            b: 30,
            l: 0,
            pad: 0,
            r: 0,
            t: 30,
          },
          barmode: "stack",
          bargap: 0,
          polar: {
            //barmode: "stack",
            //bargap: 0,
            radialaxis: {
              ticksuffix: "%",
              angle: 45,
              dtick: 20,
            },
            angularaxis: { direction: "clockwise" },
          },
          colorway: colors,
          yaxis: {
            range: [0, 20],
          },
        }}
        config={{
          responsive: true,
          displayModeBar: false,
          showAxisDragHandles: false,
        }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
        onHover={(data) => {
          console.log(data);
          console.log(
            (data.points[0].xaxis as any).l2p((data.points[0] as any).theta)
          );
          console.log((data.points[0].yaxis as any)._offset);

          console.log(
            parseFloat(
              (data.points[0].yaxis as any).l2p((data.points[0] as any).theta)
            ) + parseFloat((data.points[0].yaxis as any)._offset)
          );

          const hoverInfo = hoverInfoRef.current;

          if (hoverInfo) {
            setTitle((data.points[0] as any).fullData.name);
            setColor((data.points[0] as any).fullData.marker.color);
            setTemplate((data.points[0] as any).fullData.hovertemplate);
            setReplacements({
              r: (data.points[0] as any).r,
              theta: (data.points[0] as any).theta,
            });

            hoverInfo.style.left = `${
              (data.points[0].xaxis as any).l2p((data.points[0] as any).r) +
              (data.points[0].xaxis as any)._offset
            }px`;

            hoverInfo.style.top = `${
              (data.points[0].xaxis as any).l2p((data.points[0] as any).r) +
              (data.points[0].yaxis as any)._offset
            }px`;

            hoverInfo.style.display = "block";
          }
        }}
        onUnhover={() => {
          const hoverInfo = hoverInfoRef.current;

          if (hoverInfo) {
            //hoverInfo.style.display = "none";
          }
        }}
      />
      <div id="hoverInfoWindRose" ref={hoverInfoRef}>
        <TooltipWindrose
          color={color}
          template={template}
          replacements={replacements}
          title={title}
        />
      </div>
    </>
  );
};
