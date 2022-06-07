import React from "react";
import { createRoot } from "react-dom/client";
import { Serie } from "@nivo/line";

import { CarbonDataTableStateManager } from "carbon-data-table-state-manager";
import { BarDiagram } from "./diagrams/bar";
import { LineDiagram } from "./diagrams/line";
import { precision, Series } from "./diagrams/types";
import { CalendarDiagram } from "./diagrams/calendar";

const calendarDiagrams = document.querySelectorAll("div.calendar-diagram");
calendarDiagrams.forEach((diagram) => {
  if (
    diagram instanceof HTMLElement &&
    diagram.dataset.value &&
    diagram.dataset.obs &&
    diagram.dataset.color &&
    diagram.dataset.heading &&
    diagram.dataset.unit
  ) {
    const root = createRoot(diagram);

    root.render(
      <CalendarDiagram
        data={(window as any)[diagram.dataset.value]}
        unit={diagram.dataset.unit}
        color={JSON.parse((diagram.dataset.color as string).replace(/'/g, '"'))}
        observation={diagram.dataset.obs}
        heading={diagram.dataset.heading}
      />
    );
  }
});

const diagrams = document.querySelectorAll("div.diagram");
diagrams.forEach((diagram) => {
  if (
    diagram instanceof HTMLElement &&
    diagram.dataset.value &&
    diagram.dataset.labels &&
    diagram.dataset.obs &&
    diagram.dataset.precision &&
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
            data: (window as any)[serie]
              .map((item: number[]) => ({
                x: item[0],
                y: item[2],
                end: item[1],
              }))
              .sort((a: Series, b: Series) => a.x - b.x),
          },
        ];
      });
    } else {
      data = [
        {
          id: diagram.dataset.obs,
          data: (window as any)[diagram.dataset.value]
            .map((item: number[]) => ({
              x: item[0],
              y: item[2],
              end: item[1],
            }))
            .sort((a: Series, b: Series) => a.x - b.x),
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
            precision={diagram.dataset.precision as precision}
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
            precision={diagram.dataset.precision as precision}
          />
        );
    }
  }
});

const table = document.querySelector("div.table");
if (table) {
  const tableHeaders = (window as any).tableHeaders;
  const tableRows = (window as any).tableRows;
  const tableTitle = (window as any).tableTitle;

  const root = createRoot(table);

  root.render(
    <CarbonDataTableStateManager
      columns={tableHeaders}
      rows={tableRows}
      start={0}
      pageSize={10}
      pageSizes={[10, 25, 50, 100, 200, 500]}
      sortInfo={{
        columnId: "time",
        direction: "DESC",
      }}
      size="short"
      title={tableTitle}
      dateFormat="YYYY/MM/DD HH:mm"
    />
  );
}
