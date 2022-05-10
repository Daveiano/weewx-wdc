import { Serie } from "@nivo/line";
import React from "react";
import { createRoot } from "react-dom/client";
import { BarDiagram } from "./diagrams/bar";

import { LineDiagram } from "./diagrams/line";

const diagrams = document.querySelectorAll("div.diagram");
diagrams.forEach((diagram) => {
  if (
    diagram instanceof HTMLElement &&
    diagram.dataset.value &&
    diagram.dataset.labels &&
    diagram.dataset.obs &&
    diagram.dataset.color
  ) {
    let data: Serie[] = [];
    const combined = diagram.classList.contains("combined");
    const root = createRoot(diagram);

    if (combined) {
      const labels = JSON.parse(diagram.dataset.labels.replace(/'/g, '"'));
      const series: string[] = JSON.parse(
        diagram.dataset.value.replace(/'/g, '"')
      );

      series.forEach((serie, index) => {
        data = [
          ...data,
          {
            id: labels[index],
            data: window[serie].map((item: number[]) => ({
              x: item[0],
              y: item[1],
            })),
          },
        ];
      });
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

    switch (diagram.dataset.diagram) {
      case "bar":
        root.render(
          <BarDiagram
            color={JSON.parse(diagram.dataset.color.replace(/'/g, '"'))}
            unit={diagram.dataset.unit}
            data={data}
            observation={diagram.dataset.obs}
          />
        );
        break;
      default:
        root.render(
          <LineDiagram
            color={JSON.parse(diagram.dataset.color.replace(/'/g, '"'))}
            unit={diagram.dataset.unit}
            data={data}
            observation={diagram.dataset.obs}
          />
        );
    }
  }
});
