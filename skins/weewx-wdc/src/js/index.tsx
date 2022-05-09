import { Serie } from "@nivo/line";
import React from "react";
import { createRoot } from "react-dom/client";

import { LineDiagram } from "./diagrams/line";

const diagrams = document.querySelectorAll("div.diagram");
diagrams.forEach((diagram) => {
  if (
    diagram instanceof HTMLElement &&
    diagram.dataset.value &&
    diagram.dataset.obs &&
    diagram.dataset.color
  ) {
    let data: Serie[] = [];
    const combined = diagram.classList.contains("combined");
    const root = createRoot(diagram);

    if (combined) {
      const series = JSON.parse(diagram.dataset.value.replace(/'/g, '"'));
      console.log(series);
      for (const serie of series) {
        console.log(serie);
        data = [
          ...data,
          {
            id: serie,
            data: window[serie].map((item: number[]) => ({
              x: item[0],
              y: item[1],
            })),
          },
        ];
      }
    } else {
      data = [
        {
          id: diagram.dataset.obs,
          data: window[diagram.dataset.value].map((item: number[]) => ({
            x: item[0],
            y: item[1],
          })),
        },
      ];
    }

    root.render(
      <LineDiagram
        color={JSON.parse(diagram.dataset.color.replace(/'/g, '"'))}
        unit={diagram.dataset.unit}
        data={data}
        observation={diagram.dataset.obs}
      />
    );
  }
});
