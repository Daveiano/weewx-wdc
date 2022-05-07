import React from "react";
import { createRoot } from "react-dom/client";

import { TemperatureDiagram } from "./diagrams/temperature";

const diagrams = document.querySelectorAll("div.diagram");
diagrams.forEach((diagram) => {
  if (
    diagram instanceof HTMLElement &&
    diagram.dataset.value &&
    diagram.dataset.obs
  ) {
    const root = createRoot(diagram);
    const series = window[diagram.dataset.value];

    if (diagram.dataset.obs.toLowerCase().includes("temp")) {
      root.render(
        <TemperatureDiagram unit={diagram.dataset.unit} series={series} />
      );
    }
  }
});
