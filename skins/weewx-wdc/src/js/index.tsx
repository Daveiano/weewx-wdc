import React from "react";
import { createRoot } from "react-dom/client";

import * as d3 from "d3";

import { CarbonDataTableStateManager } from "carbon-data-table-state-manager";
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

import type { locale } from "./diagrams/types";

import localeDE from "./util/locale/de-DE.json";
import localeEnUs from "./util/locale/en-US.json";
import localeEnGb from "./util/locale/en-GB.json";
import localeIT from "./util/locale/it-IT.json";
import { D3GaugeDiagram } from "./diagrams/d3/gauge";

const localeString: locale = (window as any).weewxWdcConfig.locale;

let localeDefault: d3.TimeLocaleDefinition =
  localeEnUs as d3.TimeLocaleDefinition;

switch (localeString) {
  case "de-DE":
    localeDefault = localeDE as d3.TimeLocaleDefinition;
    break;
  case "en-GB":
    localeDefault = localeEnGb as d3.TimeLocaleDefinition;
    break;
  case "it-IT":
    localeDefault = localeIT as d3.TimeLocaleDefinition;
    break;
}

const locale = d3.timeFormatDefaultLocale(localeDefault);

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
        locale={locale}
      />
    );
  }
});

const gauges = document.querySelectorAll(".diagram-tile.gauge div.diagram");

gauges.forEach((gauge) => {
  if (gauge instanceof HTMLElement && gauge.dataset.value) {
    const root = createRoot(gauge);
    const gaugeDataInit = (window as any)[gauge.dataset.value];

    root.render(
      <D3GaugeDiagram
        current={parseFloat(gaugeDataInit.current)}
        min={parseFloat(gaugeDataInit.min)}
        max={parseFloat(gaugeDataInit.max)}
        unit={gaugeDataInit.unit}
        obs={gaugeDataInit.obs}
        rounding={gaugeDataInit.rounding}
        properties={gaugeDataInit.properties}
        label={gaugeDataInit.label}
        seriesName={gauge.dataset.value}
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
    diagram.dataset.context &&
    diagram.dataset.color &&
    diagram.dataset.diagram &&
    diagram.dataset.unit
  ) {
    let data: Serie[] = [];
    let nivoProps: any = {};
    const combined = diagram.classList.contains("combined");
    const diagramTypes = JSON.parse(diagram.dataset.diagram.replace(/'/g, '"'));
    const diagramObservations = diagram.dataset.observations
      ? JSON.parse(diagram.dataset.observations.replace(/'/g, '"'))
      : [diagram.dataset.obs];
    const diagramTypesUnique = [...new Set(diagramTypes)];
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
            observation: diagramObservations[index],
            id: `${labels[index]} ${aggregate_types[index]}`,
            data: (window as any)[serie]
              .map((item: number[]) => ({
                x: item[1],
                y: item[2],
                start: item[0],
              }))
              .sort((a: Series, b: Series) => a.x - b.x),
          },
        ];
      });
    } else {
      data = [
        {
          observation: diagramObservations[0],
          id: diagramObservations[0],
          data: (window as any)[diagram.dataset.value]
            .map((item: number[]) => ({
              x: item[1],
              y: item[2],
              start: item[0],
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

    if (
      diagramTypesUnique.length === 1 &&
      diagramTypesUnique[0] === "line" &&
      diagram.dataset.combinedkeys
    ) {
      root.render(
        <D3LineDiagram
          color={JSON.parse(diagram.dataset.color.replace(/'/g, '"'))}
          unit={JSON.parse(diagram.dataset.unit.replace(/'/g, '"'))}
          data={data}
          observation={diagramObservations}
          observationCombinedKeys={JSON.parse(
            diagram.dataset.combinedkeys.replace(/'/g, '"')
          )}
          context={diagram.dataset.context as context}
          nivoProps={nivoProps}
          locale={locale}
        />
      );
    }

    // Bar diagrams.
    if (diagramTypesUnique.length === 1 && diagramTypesUnique[0] === "bar") {
      root.render(
        <D3BarDiagram
          color={JSON.parse(diagram.dataset.color.replace(/'/g, '"'))}
          unit={JSON.parse(diagram.dataset.unit.replace(/'/g, '"'))}
          data={data}
          observation={diagramObservations}
          context={diagram.dataset.context as context}
          nivoProps={nivoProps}
          locale={locale}
        />
      );
    }

    if (
      diagramTypesUnique.length === 2 &&
      diagramTypesUnique.includes("bar") &&
      diagramTypesUnique.includes("line") &&
      diagram.dataset.combinedkeys
    ) {
      root.render(
        <CombinedDiagram
          color={JSON.parse(diagram.dataset.color.replace(/'/g, '"'))}
          unit={JSON.parse(diagram.dataset.unit.replace(/'/g, '"'))}
          data={data}
          observation={diagramObservations}
          observationCombinedKeys={JSON.parse(
            diagram.dataset.combinedkeys.replace(/'/g, '"')
          )}
          context={diagram.dataset.context as context}
          nivoProps={nivoProps}
          chartTypes={diagramTypes}
          locale={locale}
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
