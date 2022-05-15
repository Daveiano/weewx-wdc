import React from "react";
import { createRoot } from "react-dom/client";
import { Serie } from "@nivo/line";

import { TABLE_SORT_DIRECTION } from "./data-table/misc";
import TableBase from "./data-table/table-base";
import { BarDiagram } from "./diagrams/bar";
import { LineDiagram } from "./diagrams/line";

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
            data: window[serie]
              .map((item: number[]) => ({
                x: item[0],
                y: item[1],
              }))
              .sort((a, b) => a.x - b.x),
          },
        ];
      });
    } else {
      data = [
        {
          id: diagram.dataset.obs,
          data: window[diagram.dataset.value]
            .map((item: number[]) => ({
              x: item[0],
              y: item[1],
            }))
            .sort((a, b) => a.x - b.x),
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
            precision={diagram.dataset.precision}
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
            precision={diagram.dataset.precision}
          />
        );
    }
  }
});

const table = document.querySelector("div.table");
if (table) {
  const tableHeaders = window.tableHeaders;
  const tableRows = window.tableRows;
  const tableTitle = window.tableTitle;

  const root = createRoot(table);

  console.log("TEST");

  root.render(
    <TableBase
      columns={tableHeaders}
      rows={tableRows}
      start={0}
      pageSize={10}
      pageSizes={[10, 25, 50, 100, 200, 500]}
      sortInfo={{
        columnId: "timeParsed",
        direction: TABLE_SORT_DIRECTION.ASC,
      }}
      size="short"
      title={tableTitle}
    />
  );
}
