import React, { useState } from "react";
import dayjs from "dayjs";

import {
  StructuredListWrapper,
  StructuredListCell,
  StructuredListBody,
  StructuredListHead,
  StructuredListRow,
  ContentSwitcher,
  Switch,
} from "carbon-components-react";

// Obs definitions DWD: https://opendata.dwd.de/weather/lib/MetElementDefinition.xml
type ForecastDaily = {
  day: string;
  weekdayshortname: string;
  DDavg: number; // Wind dir
  FFavg: number; // Wind speed
  Neffavg: number; // CLoud Cover
  PPPPavg: number; // Pressure
  RSunD?: number; // Sun duration
  RR1c: number; // Precipitation
  Tdmin: number; // Dewpoint min
  Tdmax: number; // Dewpoint max
  TTTmax: number; // Temp max
  TTTmin: number; // Temp min
  Rd10?: number; // POP > 1.0 mm
  icon: string;
  icontitle: string;
};

interface DWDForecastProps {
  context: "day" | "hour";
  data: {
    GeneratingProcess: string;
    IssueTimeISO: string;
    Issuer: string;
    ForecastDaily: ForecastDaily[];
    coordinates: number[];
    id: string;
    name: string;
  };
}

const options = (window as any).weewxWdcConfig.dwdForecastTable;

const dirToStr = (d: number) => {
  const directions = ["N", "NO", "O", "SO", "S", "SW", "W", "NW"];
  d = d < 0 ? (d = 360 - (Math.abs(d) % 360)) : d % 360;
  return `${directions[(d / 45) | 0]}`;
};

// @todo show_legend
// @todo Document de-only
export const DWDForecast: React.FC<DWDForecastProps> = (
  props: DWDForecastProps
): React.ReactElement => {
  const [context, setContext] = useState(props.context);

  const data = props.data.ForecastDaily;

  console.log(props.data);
  console.log(data);

  return (
    <>
      <div className="bx--row">
        <div className="bx--col-sm-4 bx--col-md-8 bx--col-lg-10 bx--col-xlg-10 bx--col-max-10">
          <h3 className="bx--type-expressive-heading-03">
            Vorhersage für {props.data.name.charAt(0)}
            {props.data.name.toLowerCase().slice(1)}
          </h3>
        </div>

        {options.show_hourly == true && (
          <div className="bx--col-sm-4 bx--col-md-8 bx--col-lg-2 bx--col-xlg-2 bx--col-max-2">
            <ContentSwitcher onChange={console.log} size="sm">
              <Switch name={"daily"} text="Täglich" />
              <Switch name={"hourly"} text="Stündlich" />
            </ContentSwitcher>
          </div>
        )}
      </div>

      <StructuredListWrapper
        ariaLabel="Wettervorhersage vom DWD"
        className="forecast-list"
      >
        {options.show_legend == true && (
          <StructuredListHead>
            <StructuredListRow head tabIndex={0}>
              <StructuredListCell head></StructuredListCell>
              {data.map((day, index) => {
                return (
                  <StructuredListCell key={index} head>
                    {day.weekdayshortname}, <br /> {day.day}
                  </StructuredListCell>
                );
              })}
            </StructuredListRow>
          </StructuredListHead>
        )}
        <StructuredListBody>
          {options.show_outlook && (
            <StructuredListRow tabIndex={0}>
              <StructuredListCell></StructuredListCell>
              {data.map((day, index) => {
                return (
                  <StructuredListCell
                    className="index"
                    key={index}
                    style={{ paddingBottom: "1rem" }}
                  >
                    <img src={day.icon} title={day.icontitle} />
                  </StructuredListCell>
                );
              })}
            </StructuredListRow>
          )}

          {options.show_temp == true && (
            <StructuredListRow tabIndex={0}>
              <StructuredListCell>
                Temp <br />
                <span className="unit-label">in °C</span>
              </StructuredListCell>
              {data.map((day, index) => {
                return (
                  <StructuredListCell className="index" key={index}>
                    {Intl.NumberFormat("de-DE", {
                      //style: "unit",
                      //unit: "celsius",
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }).format(day.TTTmax)}
                    <br />
                    {Intl.NumberFormat("de-DE", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }).format(day.TTTmin)}
                  </StructuredListCell>
                );
              })}
            </StructuredListRow>
          )}

          {options.show_dewpoint == true && (
            <StructuredListRow tabIndex={0}>
              <StructuredListCell>
                Taupunkt <br />
                <span className="unit-label">in °C</span>
              </StructuredListCell>
              {data.map((day, index) => {
                return (
                  <StructuredListCell className="index" key={index}>
                    {Intl.NumberFormat("de-DE", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }).format(day.Tdmax)}
                    <br />
                    {Intl.NumberFormat("de-DE", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }).format(day.Tdmin)}
                  </StructuredListCell>
                );
              })}
            </StructuredListRow>
          )}

          {options.show_pressure == true && (
            <StructuredListRow tabIndex={0}>
              <StructuredListCell>
                Luftdruck <br />
                <span className="unit-label">in mbar</span>
              </StructuredListCell>
              {data.map((day, index) => {
                return (
                  <StructuredListCell className="index" key={index}>
                    {Intl.NumberFormat("de-DE", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                      useGrouping: false,
                    }).format(day.PPPPavg)}
                  </StructuredListCell>
                );
              })}
            </StructuredListRow>
          )}

          {options.show_wind == true && (
            <StructuredListRow tabIndex={0}>
              <StructuredListCell>
                Wind <br />
                <span className="unit-label">in km/h</span>
              </StructuredListCell>
              {data.map((day, index) => {
                return (
                  <StructuredListCell className="index" key={index}>
                    {Intl.NumberFormat("de-DE", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(day.FFavg)}
                    <br /> {dirToStr(day.DDavg)}
                  </StructuredListCell>
                );
              })}
            </StructuredListRow>
          )}

          {options.show_pop == true && (
            <StructuredListRow tabIndex={0}>
              <StructuredListCell>
                Niderschlagswahrscheinlichkeit <br />
                <span className="unit-label">in %</span>
              </StructuredListCell>
              {data.map((day, index) => {
                return (
                  <StructuredListCell className="index" key={index}>
                    {day.Rd10 ? <>{day.Rd10}</> : "-"}
                  </StructuredListCell>
                );
              })}
            </StructuredListRow>
          )}

          {options.show_precip == true && (
            <StructuredListRow tabIndex={0}>
              <StructuredListCell>
                Niederschlag <br />
                <span className="unit-label">in mm</span>
              </StructuredListCell>
              {data.map((day, index) => {
                return (
                  <StructuredListCell className="index" key={index}>
                    {Intl.NumberFormat("de-DE", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(day.RR1c)}
                  </StructuredListCell>
                );
              })}
            </StructuredListRow>
          )}

          {options.show_cloud_cover == true && (
            <StructuredListRow tabIndex={0}>
              <StructuredListCell>
                Bewölkung <br />
                <span className="unit-label">in %</span>
              </StructuredListCell>
              {data.map((day, index) => {
                return (
                  <StructuredListCell className="index" key={index}>
                    {Intl.NumberFormat("de-DE", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(day.Neffavg)}
                  </StructuredListCell>
                );
              })}
            </StructuredListRow>
          )}

          {options.show_sun_dur == true && (
            <StructuredListRow tabIndex={0}>
              <StructuredListCell>
                Rel. Sonnenscheindauer <br />
                <span className="unit-label">in %</span>
              </StructuredListCell>
              {data.map((day, index) => {
                return (
                  <StructuredListCell className="index" key={index}>
                    {day.RSunD ? (
                      <>
                        {Intl.NumberFormat("de-DE", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(day.RSunD)}
                      </>
                    ) : (
                      <>-</>
                    )}
                  </StructuredListCell>
                );
              })}
            </StructuredListRow>
          )}
        </StructuredListBody>
      </StructuredListWrapper>
      <div className="bx--type-helper-text-01" style={{ marginTop: "0.5rem" }}>
        Vorhersage vom{" "}
        <a href="https://www.dwd.de" target="_blank">
          DWD
        </a>
        . Angefordert am{" "}
        {dayjs(props.data.IssueTimeISO).format("DD.MM.YYYY HH:mm")}, für
        geocode={props.data.coordinates[0]}, {props.data.coordinates[1]}. Mosmix{" "}
        <a
          target="_blank"
          href="https://www.dwd.de/DE/leistungen/met_verfahren_mosmix/mosmix_stationskatalog.cfg?view=nasPublication&nn=16102"
        >
          Stations ID
        </a>
        : {props.data.id}. Stationsname: {props.data.name}.
      </div>
    </>
  );
};
