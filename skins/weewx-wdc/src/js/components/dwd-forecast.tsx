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
  timestamp: number;
  day: string;
  weekdayshortname: string;
  DDavg: number; // Wind dir
  FFavg: number; // Wind speed
  Neffavg: number; // CLoud Cover
  PPPPavg: number; // Pressure
  RSunD?: number; // Sunshine duration
  RR1c: number; // Precipitation
  Tdmin: number; // Dewpoint min
  Tdmax: number; // Dewpoint max
  TTTmax: number; // Temp max
  TTTmin: number; // Temp min
  Rd10?: number; // POP > 1.0mm 24h
  icon: string;
  icontitle: string;
};

type ForecastHourly = {
  DD: number; // Wind dir
  FF: number; // Wind speed
  Neff: number; // CLoud Cover
  PPPP: number; // Pressure
  R101: number; // POP > 0.1mm 1h
  RR1c: number; // Precipitation
  SunD1: number; // Sunshine duration in s for last 1h
  Td: number; // Dew point
  TTT: number; // Temp
  timestamp: number; // Unix time
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
    ForecastHourly: ForecastHourly[];
    coordinates: number[];
    id: string;
    name: string;
  };
}

const options = (window as any).weewxWdcConfig.dwdForecastTable;
const iconPath = (window as any).weewxWdcConfig.dwdIconPath;
const translations = (window as any).weewxWdcConfig.translations;

const dirToStr = (d: number) => {
  const directions = ["N", "NO", "O", "SO", "S", "SW", "W", "NW"];
  d = d < 0 ? (d = 360 - (Math.abs(d) % 360)) : d % 360;
  return `${directions[(d / 45) | 0]}`;
};

// @todo Document de-only
export const DWDForecast: React.FC<DWDForecastProps> = (
  props: DWDForecastProps
): React.ReactElement => {
  const [context, setContext] = useState(props.context);
  const index = window.location.pathname.includes("index.html");
  const switcherClassNames = index
    ? "bx--col-sm-4 bx--col-md-8 bx--col-lg-4 bx--col-xlg-4 bx--col-max-4"
    : "bx--col-sm-4 bx--col-md-8 bx--col-lg-4 bx--col-xlg-2 bx--col-max-2";
  const headerClassNames = index
    ? "bx--col-sm-4 bx--col-md-8 bx--col-lg-8 bx--col-xlg-8 bx--col-max-8"
    : "bx--col-sm-4 bx--col-md-8 bx--col-lg-8 bx--col-xlg-10 bx--col-max-10";

  let forecastDaily = props.data.ForecastDaily.filter(
    (item) => item.timestamp >= dayjs().startOf("day").unix()
  );

  const forecastHourly = props.data.ForecastHourly.filter(
    (item) => item.timestamp >= Math.floor(Date.now() / 1000)
  );

  if (index) {
    forecastDaily = forecastDaily.slice(0, 5);
  }

  return (
    <div
      className={`${context} ${index ? "index" : ""} ${
        parseInt(options.carbon_icons) ? "carbon-icons" : ""
      }`}
    >
      <div className="bx--row" style={{ marginBottom: "1rem" }}>
        <div className={headerClassNames}>
          <h3 className="bx--type-expressive-heading-03">
            {translations.Forecast_for} {props.data.name.charAt(0)}
            {props.data.name.toLowerCase().slice(1)}
          </h3>
        </div>

        {options.show_hourly == true && (
          <div className={switcherClassNames}>
            <ContentSwitcher
              onChange={(data: any) => setContext(data.name)}
              size="sm"
            >
              <Switch
                name={"day"}
                text={translations.Daily.replace("&#228;", "ä")}
              />
              <Switch
                name={"hour"}
                text={translations.Hourly.replace("&#252;", "ü")}
              />
            </ContentSwitcher>
          </div>
        )}
      </div>

      <div
        style={{ display: "block", whiteSpace: "nowrap", overflowX: "auto" }}
      >
        <StructuredListWrapper
          ariaLabel="Wettervorhersage vom DWD"
          className="forecast-list"
        >
          <StructuredListHead>
            <StructuredListRow head tabIndex={0}>
              <StructuredListCell head></StructuredListCell>
              {context === "day" ? (
                <>
                  {forecastDaily.map((day, index) => {
                    return (
                      <StructuredListCell key={index} head>
                        {day.weekdayshortname}, <br /> {day.day}
                      </StructuredListCell>
                    );
                  })}
                </>
              ) : (
                <>
                  {forecastHourly.map((day, index) => {
                    return (
                      <StructuredListCell
                        key={index}
                        head
                        style={{ minWidth: "100px" }}
                      >
                        {dayjs.unix(day.timestamp).format("HH:mm") ===
                          "00:00" || index === 0 ? (
                          <>
                            <span style={{ fontWeight: "200" }}>
                              {dayjs.unix(day.timestamp).format("DD.MM.YYYY")}
                            </span>
                          </>
                        ) : null}
                        <br /> {dayjs.unix(day.timestamp).format("HH:mm")}
                      </StructuredListCell>
                    );
                  })}
                </>
              )}
            </StructuredListRow>
          </StructuredListHead>

          <StructuredListBody>
            {options.show_outlook && (
              <StructuredListRow tabIndex={0}>
                <StructuredListCell></StructuredListCell>
                {context === "day" ? (
                  <>
                    {forecastDaily.map((day, index) => {
                      return (
                        <StructuredListCell
                          className="index"
                          key={index}
                          style={{ paddingBottom: "1rem" }}
                        >
                          <img
                            src={
                              parseInt(options.carbon_icons)
                                ? day.icon.replace("png", "svg")
                                : day.icon
                            }
                            title={day.icontitle}
                          />
                        </StructuredListCell>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {forecastHourly.map((hour, index) => {
                      return (
                        <StructuredListCell
                          className="index"
                          key={index}
                          style={{ paddingBottom: "1rem" }}
                        >
                          <img
                            src={
                              parseInt(options.carbon_icons)
                                ? hour.icon.replace("png", "svg")
                                : hour.icon
                            }
                            title={hour.icontitle}
                          />
                        </StructuredListCell>
                      );
                    })}
                  </>
                )}
              </StructuredListRow>
            )}

            {options.show_temp == true && (
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>
                  Temp <br />
                  <span className="unit-label">in °C</span>
                </StructuredListCell>

                {context === "day" ? (
                  <>
                    {forecastDaily.map((day, index) => {
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
                  </>
                ) : (
                  <>
                    {forecastHourly.map((hour, index) => {
                      return (
                        <StructuredListCell className="index" key={index}>
                          {Intl.NumberFormat("de-DE", {
                            //style: "unit",
                            //unit: "celsius",
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          }).format(hour.TTT)}
                        </StructuredListCell>
                      );
                    })}
                  </>
                )}
              </StructuredListRow>
            )}

            {options.show_dewpoint == true && (
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>
                  {translations.obs_dew_point} <br />
                  <span className="unit-label">in °C</span>
                </StructuredListCell>
                {context === "day" ? (
                  <>
                    {forecastDaily.map((day, index) => {
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
                  </>
                ) : (
                  <>
                    {forecastHourly.map((day, index) => {
                      return (
                        <StructuredListCell className="index" key={index}>
                          {Intl.NumberFormat("de-DE", {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          }).format(day.Td)}
                        </StructuredListCell>
                      );
                    })}
                  </>
                )}
              </StructuredListRow>
            )}

            {options.show_pressure == true && (
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>
                  {translations.obs_barometer} <br />
                  <span className="unit-label">in mbar</span>
                </StructuredListCell>
                {context === "day" ? (
                  <>
                    {forecastDaily.map((day, index) => {
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
                  </>
                ) : (
                  <>
                    {forecastHourly.map((day, index) => {
                      return (
                        <StructuredListCell className="index" key={index}>
                          {Intl.NumberFormat("de-DE", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                            useGrouping: false,
                          }).format(day.PPPP)}
                        </StructuredListCell>
                      );
                    })}
                  </>
                )}
              </StructuredListRow>
            )}

            {options.show_wind == true && (
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>
                  {translations.obs_wind_speed} <br />
                  <span className="unit-label">in km/h</span>
                </StructuredListCell>
                {context === "day" ? (
                  <>
                    {forecastDaily.map((day, index) => {
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
                  </>
                ) : (
                  <>
                    {forecastHourly.map((hour, index) => {
                      return (
                        <StructuredListCell className="index" key={index}>
                          {Intl.NumberFormat("de-DE", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(hour.FF)}
                          <br /> {dirToStr(hour.DD)}
                        </StructuredListCell>
                      );
                    })}
                  </>
                )}
              </StructuredListRow>
            )}

            {options.show_pop == true && (
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>
                  {translations.POP} <br />
                  <span className="unit-label">in %</span>
                </StructuredListCell>
                {context === "day" ? (
                  <>
                    {forecastDaily.map((day, index) => {
                      return (
                        <StructuredListCell className="index" key={index}>
                          {day.Rd10 ? <>{day.Rd10}</> : "-"}
                        </StructuredListCell>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {forecastHourly.map((hour, index) => (
                      <StructuredListCell className="index" key={index}>
                        {hour.R101}
                      </StructuredListCell>
                    ))}
                  </>
                )}
              </StructuredListRow>
            )}

            {options.show_precip == true && (
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>
                  {translations.obs_precipitation} <br />
                  <span className="unit-label">in mm</span>
                </StructuredListCell>
                {context === "day" ? (
                  <>
                    {forecastDaily.map((day, index) => {
                      return (
                        <StructuredListCell className="index" key={index}>
                          {Intl.NumberFormat("de-DE", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(day.RR1c)}
                        </StructuredListCell>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {forecastHourly.map((hour, index) => {
                      return (
                        <StructuredListCell className="index" key={index}>
                          {Intl.NumberFormat("de-DE", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(hour.RR1c)}
                        </StructuredListCell>
                      );
                    })}
                  </>
                )}
              </StructuredListRow>
            )}

            {options.show_cloud_cover == true && (
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>
                  {translations.obs_cloud_cover} <br />
                  <span className="unit-label">in %</span>
                </StructuredListCell>
                {context === "day" ? (
                  <>
                    {forecastDaily.map((day, index) => {
                      return (
                        <StructuredListCell className="index" key={index}>
                          {Intl.NumberFormat("de-DE", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(day.Neffavg)}
                        </StructuredListCell>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {forecastHourly.map((day, index) => {
                      return (
                        <StructuredListCell className="index" key={index}>
                          {Intl.NumberFormat("de-DE", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(day.Neff)}
                        </StructuredListCell>
                      );
                    })}
                  </>
                )}
              </StructuredListRow>
            )}

            {options.show_sun_dur == true && (
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>
                  {translations.obs_sunshine_dur} <br />
                  <span className="unit-label">in %</span>
                </StructuredListCell>
                {context === "day" ? (
                  <>
                    {forecastDaily.map((day, index) => (
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
                    ))}
                  </>
                ) : (
                  <>
                    {forecastHourly.map((hour, index) => (
                      <StructuredListCell className="index" key={index}>
                        {hour.SunD1 ? (
                          <>
                            {Intl.NumberFormat("de-DE", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(hour.SunD1 / 36)}
                          </>
                        ) : (
                          <>-</>
                        )}
                      </StructuredListCell>
                    ))}
                  </>
                )}
              </StructuredListRow>
            )}
          </StructuredListBody>
        </StructuredListWrapper>
      </div>

      <div className="bx--type-helper-text-01" style={{ marginTop: "0.5rem" }}>
        {translations.Forecast_from}{" "}
        <a href="https://www.dwd.de" target="_blank">
          DWD
        </a>
        . {translations.Issued_on}{" "}
        {dayjs(props.data.IssueTimeISO).format("DD.MM.YYYY HH:mm")}, geocode=
        {props.data.coordinates[0]}, {props.data.coordinates[1]}. Mosmix{" "}
        <a
          target="_blank"
          href="https://www.dwd.de/DE/leistungen/met_verfahren_mosmix/mosmix_stationskatalog.cfg?view=nasPublication&nn=16102"
        >
          Stations ID
        </a>
        : {props.data.id}. {translations.Station_name}: {props.data.name}.
      </div>
    </div>
  );
};
