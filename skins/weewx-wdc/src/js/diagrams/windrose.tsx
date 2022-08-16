import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import createPlotlyComponent from "react-plotly.js/factory";
import { Maximize } from "../assets/maximize";
import color from "color";

import { TooltipWindrose } from "../components/tooltip-windrose";
import { WindRoseProps } from "./types";

const Plot = createPlotlyComponent((window as any).Plotly);
const colors = (window as any).weewxWdcConfig.windRoseColors;

export const WindRoseDiagram: FunctionComponent<WindRoseProps> = (
  props: WindRoseProps
): React.ReactElement => {
  const hoverInfoRef = useRef<HTMLDivElement>(null);
  const hoverInfoRefFullscreen = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [hoverColor, setColor] = useState("");
  const [template, setTemplate] = useState("");
  const [replacements, setReplacements] = useState({});
  const [hoverInfoPosition, setHoverInfoPosition] = useState({
    top: 0,
    left: 0,
  });
  const handle = useFullScreenHandle();
  // @todo Use Color export from carbon, see ui-01.
  const backgroundColorDarkModeLightness = color("#393939").lightness();
  // @todo This adds one MutationObserver per LineDiagram. Add this to one
  //    general component which shares the state.
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const callback = (mutationsList: Array<MutationRecord>) => {
    mutationsList.forEach((mutation) => {
      if (
        mutation.attributeName === "class" &&
        (mutation.target as HTMLElement).classList.contains("dark")
      ) {
        setDarkMode(true);
      } else {
        setDarkMode(false);
      }
    });
  };

  useEffect(() => {
    const mutationObserver = new MutationObserver(callback);
    mutationObserver.observe(document.documentElement, { attributes: true });
    return () => {
      mutationObserver.disconnect();
    };
  }, []);

  console.log(backgroundColorDarkModeLightness);
  colors.map((c: string) => {
    console.log(color(c).lightness());
  });

  const windroseDiagram = (
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
        colorway: darkMode
          ? colors.map((c: string) =>
              color(c).lightness() <= backgroundColorDarkModeLightness * 2
                ? color(c).lighten(0.25).desaturate(0.2).hex()
                : color(c).lighten(0.1).desaturate(0.1).hex()
            )
          : colors,
        yaxis: {
          range: [0, 20],
        },
      }}
      config={{
        responsive: true,
        displayModeBar: false,
        showAxisDragHandles: false,
      }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      useResizeHandler={true}
      onBeforeHover={(event) => {
        if ((event as any).type === "mousemove") {
          setHoverInfoPosition({
            top: (event as any).layerY,
            left: (event as any).layerX,
          });
        }

        return true;
      }}
      onHover={(data) => {
        let hoverInfo = hoverInfoRef.current;

        if (handle.active) {
          hoverInfo = hoverInfoRefFullscreen.current;
        }

        if (hoverInfo) {
          setTitle((data.points[0] as any).fullData.name);
          setColor((data.points[0] as any).fullData.marker.color);
          setTemplate((data.points[0] as any).fullData.hovertemplate);
          setReplacements({
            r: (data.points[0] as any).r,
            theta: (data.points[0] as any).theta,
          });

          hoverInfo.style.display = "block";
        }
      }}
      onUnhover={() => {
        let hoverInfo = hoverInfoRef.current;

        if (handle.active) {
          hoverInfo = hoverInfoRefFullscreen.current;
        }

        if (hoverInfo) {
          hoverInfo.style.display = "none";
        }
      }}
    />
  );

  return (
    <>
      <Maximize onClick={handle.enter} />
      <div className="diagram">{windroseDiagram}</div>
      <div
        id="hoverInfoWindRose"
        ref={hoverInfoRef}
        className="windrose-tooltip"
        style={{
          left: `${hoverInfoPosition.left + 25}px`,
          top: `${hoverInfoPosition.top - 10}px`,
        }}
      >
        <TooltipWindrose
          color={hoverColor}
          template={template}
          replacements={replacements}
          title={title}
        />
      </div>
      <FullScreen handle={handle}>
        <Maximize onClick={handle.exit} />
        {windroseDiagram}
        <div
          id="hoverInfoWindRose"
          ref={hoverInfoRefFullscreen}
          className="windrose-tooltip"
          style={{
            left: `${hoverInfoPosition.left + 60}px`,
            top: `${hoverInfoPosition.top + 25}px`,
          }}
        >
          <TooltipWindrose
            color={hoverColor}
            template={template}
            replacements={replacements}
            title={title}
          />
        </div>
      </FullScreen>
    </>
  );
};
