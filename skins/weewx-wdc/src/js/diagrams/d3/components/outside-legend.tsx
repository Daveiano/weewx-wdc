import React, { useRef, useEffect } from "react";
import { Serie, legendPosition } from "../../types";

type OutsideLegendProps = {
  legendPosition: legendPosition;
  data: Serie[];
  units: string[];
  colors: string[];
  setLegendHeight: (height: number) => void;
  marginLeft: number;
  showUnits?: boolean;
};

export const OutsideLegend = (
  props: OutsideLegendProps
): React.ReactElement => {
  const size = 14;
  const legend = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (legend.current) {
      props.setLegendHeight(legend.current.offsetHeight);
    }
  }, []);

  return (
    <div
      className="diagram-legend"
      style={
        props.legendPosition === "bottom"
          ? { bottom: 0, left: props.marginLeft }
          : { left: props.marginLeft }
      }
      ref={legend}
    >
      {props.data.map((item, index) => (
        <div className="legend-item" key={index}>
          <div
            className="legend-color"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: props.colors[index],
            }}
          ></div>
          <div className="legend-label">
            {item.id}
            {props.showUnits && ` (${props.units[index]})`}
          </div>
        </div>
      ))}
    </div>
  );
};
