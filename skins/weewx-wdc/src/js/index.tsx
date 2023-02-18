import React from "react";
import { createRoot } from "react-dom/client";

import { CarbonDataTableStateManager } from "carbon-data-table-state-manager";
import { BarDiagram } from "./diagrams/bar";
import { LineDiagram } from "./diagrams/line";
import type { context, Serie, Series } from "./diagrams/types";
import { CalendarDiagram } from "./diagrams/calendar";
import { StatisticsSelect } from "./components/statistics-select";

import "./../scss/index.scss";
import { WindRoseDiagram } from "./diagrams/windrose";
import { DWDWarning } from "./components/dwd-warning";
import { DWDForecast } from "./components/dwd-forecast";
import { CombinedDiagram } from "./diagrams/d3/combined";
import { D3BarDiagram } from "./diagrams/d3/bar";
import { D3LineDiagram } from "./diagrams/d3/line";

// FEATURE FLAG: Use D3 diagrams.
const useD3Diagrams = false;

const calendarDiagrams = document.querySelectorAll(
  "div.calendar-diagram-clim-wrap"
);
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

const diagrams = document.querySelectorAll("div.diagram:not(.plotly)");
diagrams.forEach((diagram) => {
  if (
    diagram instanceof HTMLElement &&
    diagram.dataset.value &&
    diagram.dataset.labels &&
    diagram.dataset.aggregateType &&
    diagram.dataset.obs &&
    diagram.dataset.context &&
    diagram.dataset.color &&
    diagram.dataset.diagram
  ) {
    let data: Serie[] = [];
    let nivoProps: any = {};
    const combined = diagram.classList.contains("combined");
    const diagramTypes = JSON.parse(diagram.dataset.diagram.replace(/'/g, '"'));
    const root = createRoot(diagram);

    if (combined) {
      const labels = JSON.parse(diagram.dataset.labels.replace(/'/g, '"'));
      const aggregate_types = JSON.parse(
        diagram.dataset.aggregateType.replace(/'/g, '"')
      );
      const series: string[] = JSON.parse(
        diagram.dataset.value.replace(/'/g, '"')
      );

      series.forEach((serie, index) => {
        data = [
          ...data,
          {
            id: `${labels[index]} ${
              aggregate_types[index][0].toUpperCase() +
              aggregate_types[index].slice(1)
            }`,
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

    if (diagram.dataset.nivoProps) {
      nivoProps = JSON.parse(diagram.dataset.nivoProps.replace(/'/g, '"'));

      for (const item in nivoProps) {
        if (nivoProps[item] === "True" || nivoProps[item] === "False") {
          nivoProps[item] = nivoProps[item] === "True";
        }
      }
    }

    if (diagramTypes.length === 1 && diagramTypes[0] === "line") {
      if (useD3Diagrams) {
        root.render(
          <D3LineDiagram
            color={JSON.parse(diagram.dataset.color.replace(/'/g, '"'))}
            unit={
              diagram.dataset.unit
                ? JSON.parse(diagram.dataset.unit.replace(/'/g, '"'))
                : ""
            }
            data={data}
            observation={diagram.dataset.obs}
            context={diagram.dataset.context as context}
            nivoProps={nivoProps}
          />
        );
      } else {
        root.render(
          <LineDiagram
            color={JSON.parse(diagram.dataset.color.replace(/'/g, '"'))}
            unit={
              diagram.dataset.unit
                ? JSON.parse(diagram.dataset.unit.replace(/'/g, '"'))
                : ""
            }
            data={data}
            observation={diagram.dataset.obs}
            context={diagram.dataset.context as context}
            nivoProps={nivoProps}
          />
        );
      }
    }

    // Bar diagrams.
    if (diagramTypes.length === 1 && diagramTypes[0] === "bar") {
      if (useD3Diagrams) {
        root.render(
          <D3BarDiagram
            color={JSON.parse(diagram.dataset.color.replace(/'/g, '"'))}
            unit={
              diagram.dataset.unit
                ? JSON.parse(diagram.dataset.unit.replace(/'/g, '"'))
                : ""
            }
            data={data}
            observation={diagram.dataset.obs}
            context={diagram.dataset.context as context}
            nivoProps={nivoProps}
          />
        );
      } else {
        root.render(
          <BarDiagram
            color={JSON.parse(diagram.dataset.color.replace(/'/g, '"'))}
            unit={
              diagram.dataset.unit
                ? JSON.parse(diagram.dataset.unit.replace(/'/g, '"'))
                : ""
            }
            data={data}
            observation={diagram.dataset.obs}
            context={diagram.dataset.context as context}
            nivoProps={nivoProps}
          />
        );
      }
    }

    if (
      diagramTypes.length > 1 &&
      diagramTypes.includes("bar") &&
      diagramTypes.includes("line")
    ) {
      root.render(
        <CombinedDiagram
          color={JSON.parse(diagram.dataset.color.replace(/'/g, '"'))}
          unit={
            diagram.dataset.unit
              ? JSON.parse(diagram.dataset.unit.replace(/'/g, '"'))
              : ""
          }
          data={data}
          observation={diagram.dataset.obs}
          context={diagram.dataset.context as context}
          nivoProps={nivoProps}
          chartTypes={diagramTypes}
        />
      );
    }
  }
});

const plotlyDiagrams = document.querySelectorAll("div.diagram.plotly");
plotlyDiagrams.forEach((plotyDiagram) => {
  const root = createRoot(plotyDiagram);

  if (
    plotyDiagram.classList.contains("windrose") &&
    plotyDiagram instanceof HTMLElement &&
    plotyDiagram.dataset.value
  ) {
    root.render(
      <WindRoseDiagram data={(window as any)[plotyDiagram.dataset.value]} />
    );
  }
});

const table = document.querySelector("div.table");
if (table) {
  const tableHeaders = (window as any).tableHeaders;
  const tableRows = (window as any).tableRows;
  const tableTitle = (window as any).tableTitle;
  // @todo Could be in a global config obj,
  // @see window.weewxWdcConfig in html-head.inc.
  const context = (window as any).context;

  const root = createRoot(table);

  root.render(
    <CarbonDataTableStateManager
      columns={tableHeaders}
      rows={tableRows}
      start={0}
      pageSize={context === "alltime" || context == "year" ? 20 : 10}
      pageSizes={[10, 20, 50, 100, 200, 500]}
      sortInfo={{
        columnId: "time",
        direction: "DESC",
      }}
      size="short"
      title={tableTitle}
      dateFormat={
        context === "alltime" || context == "year"
          ? "YYYY/MM/DD"
          : "YYYY/MM/DD HH:mm"
      }
    />
  );
}

const statsSelect = document.querySelector("div.statistics-day-select");
if (statsSelect) {
  const root = createRoot(statsSelect);

  root.render(<StatisticsSelect items={(window as any).archive_days} />);
}

const dwdWarnings = document.querySelectorAll("div.dwd-warning");
dwdWarnings.forEach((warning) => {
  if (warning instanceof HTMLElement && warning.dataset.region) {
    const root = createRoot(warning);

    root.render(
      <DWDWarning
        warnings={(window as any)[`warningdata_${warning.dataset.region}`]}
      />
    );
  }
});

const dwdForecast = document.querySelector("div.dwd-forecast");
if (dwdForecast) {
  const root = createRoot(dwdForecast);

  root.render(
    <DWDForecast context="day" data={(window as any).dwdForecastData} />
  );
}
