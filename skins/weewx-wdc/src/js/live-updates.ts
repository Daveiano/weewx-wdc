import dayjs from "dayjs";
import { Client, Message } from "paho-mqtt";

/**
 * @file
 * Live updates via MQTT WebSockets.
 *
 * @see https://www.eclipse.org/paho/clients/js/
 * @see https://www.hivemq.com/blog/mqtt-client-library-encyclopedia-paho-js/
 */

const ordinalCompass = (window as any).weewxWdcConfig.ordinalCompass;
const mqtt_host: string = (window as any).mqtt_host;
const mqtt_port: string = (window as any).mqtt_port;
const mqtt_topic: string = (window as any).mqtt_topic;
const mqtt_ssl: string = (window as any).mqtt_ssl;

const websiteMessageContainer = document.getElementById(
  "notification-container-mqtt"
);
const notfication = websiteMessageContainer!.querySelector(
  "bx-inline-notification"
);

const dependentObs = {
  windSpeed: "windDir",
  windGust: "windGustDir",
};

const _splitMQTTProp = (key: string): string[] => {
  const underscoreObservations =
    /^(pm\d+_\d|lightning_[a-z]+_count|lightning_distance|lightning_energy)_(.+)/;
  const matchedKey = key.match(underscoreObservations);

  if (Array.isArray(matchedKey)) {
    const observation = matchedKey[1];
    const splitted = matchedKey[2].split("_");
    splitted.unshift(observation);

    return splitted;
  } else {
    return key.split("_");
  }
};

const _getUnitFromMQTTProp = (keySplitted: string[]): string => {
  let unitMQTT = "";

  if (keySplitted.length > 1) {
    keySplitted.shift();
    unitMQTT = keySplitted.join("_");
  }

  return unitMQTT;
};

const _updateStatTile = (
  statTile: HTMLElement,
  key: string,
  observation: string,
  unit: string,
  value: number,
  rounding: number,
  payLoad: any,
  unitMQTT: string,
  dayChange: boolean
) => {
  // Update the main value.
  const sumObs = statTile
    .querySelector(".stat-title-obs-value .raw")
    ?.classList.contains("raw-sum");

  if (sumObs) {
    // Use the dayXXX value (sum).
    const sumValue =
      payLoad[
        `day${observation[0].toUpperCase()}${observation.slice(1)}_${unitMQTT}`
      ];

    if (sumValue) {
      statTile.querySelector(
        ".stat-title-obs-value .raw"
      )!.innerHTML = `${parseFloat(sumValue).toFixed(rounding)}${unit}`;
    }
  } else {
    // Use the current value.
    statTile.querySelector(
      ".stat-title-obs-value .raw"
    )!.innerHTML = `${value}${unit}`;
  }

  // For eg. the windDir arrows on the windSpeed and gustSpeed tiles.
  const statTileDetail = statTile.querySelector<HTMLElement>(
    ".stat-title-obs-value .stat-detail"
  );

  // Re-append the detail.
  if (statTileDetail) {
    if (
      (observation === "windSpeed" && !payLoad["windDir"]) ||
      (observation === "windGust" && !payLoad["windGustDir"])
    ) {
      statTileDetail.style.display = "none";
    }

    if (
      (observation === "windSpeed" && payLoad["windDir"]) ||
      (observation === "windGust" && payLoad["windGustDir"])
    ) {
      statTileDetail.style.display = "inline";

      const ordinal =
        ordinalCompass[
          Math.floor(
            parseInt(payLoad[dependentObs[observation]]) / 22.5 + 0.5
          ) % 16
        ];

      if (statTileDetail) {
        statTileDetail.querySelector(".value-detail")!.textContent = ordinal;
      }

      (
        statTileDetail.querySelector("svg") as SVGElement
      ).style.transform = `rotate(${
        parseInt(payLoad[dependentObs[observation]]) + 90
      }deg)`;
    }
  }

  // Update min/max if available.
  const min = statTile.querySelector<HTMLElement>(".value-min"),
    minValue = min
      ? min!.querySelector(".stat-value span.value")!.innerHTML
      : "";

  if (min && (payLoad[key] < parseFloat(minValue) || dayChange)) {
    min.querySelector(".stat-value span.value")!.textContent = `${parseFloat(
      payLoad[key]
    ).toFixed(rounding)}${unit}`;

    // Update min/max time if enabled.
    const timeToolTip = min.querySelector("bx-tooltip-definition");

    if (timeToolTip) {
      timeToolTip.setAttribute(
        "body-text",
        dayjs.unix(payLoad.dateTime).format("HH:mm:ss")
      );
    }

    // windDir.
    if (
      (observation === "windSpeed" && !payLoad["windDir"]) ||
      (observation === "windGust" && !payLoad["windGustDir"])
    ) {
      (
        min.querySelector(".stat-wind-dir.stat-detail") as HTMLElement
      ).style.display = "none";
    }
    if (
      (observation === "windSpeed" && payLoad["windDir"]) ||
      (observation === "windGust" && payLoad["windGustDir"])
    ) {
      (
        min.querySelector(".stat-wind-dir.stat-detail") as HTMLElement
      ).style.display = "inline";

      const ordinal =
        ordinalCompass[
          Math.floor(
            parseInt(payLoad[dependentObs[observation]]) / 22.5 + 0.5
          ) % 16
        ];

      if (min.querySelector(".stat-wind-dir.stat-detail")) {
        min.querySelector(
          ".stat-wind-dir.stat-detail"
        )!.textContent = `, ${ordinal}`;
      }
    }
  }

  const max = statTile.querySelector(".value-max"),
    maxValue = max
      ? max!.querySelector(".stat-value span.value")!.innerHTML
      : "";

  if (max && (payLoad[key] > parseFloat(maxValue) || dayChange)) {
    max.querySelector(".stat-value span.value")!.textContent = `${parseFloat(
      payLoad[key]
    ).toFixed(rounding)}${unit}`;

    // Update min/max time if enabled.
    const timeToolTip = max.querySelector("bx-tooltip-definition");

    if (timeToolTip) {
      timeToolTip.setAttribute(
        "body-text",
        dayjs.unix(payLoad.dateTime).format("HH:mm:ss")
      );
    }

    // windDir.
    if (
      (observation === "windSpeed" && !payLoad["windDir"]) ||
      (observation === "windGust" && !payLoad["windGustDir"])
    ) {
      (
        max.querySelector(".stat-wind-dir.stat-detail") as HTMLElement
      ).style.display = "none";
    }
    if (
      (observation === "windSpeed" && payLoad["windDir"]) ||
      (observation === "windGust" && payLoad["windGustDir"])
    ) {
      (
        max.querySelector(".stat-wind-dir.stat-detail") as HTMLElement
      ).style.display = "inline";
      const ordinal =
        ordinalCompass[
          Math.floor(
            parseInt(payLoad[dependentObs[observation]]) / 22.5 + 0.5
          ) % 16
        ];

      if (max.querySelector(".stat-wind-dir.stat-detail")) {
        max.querySelector(
          ".stat-wind-dir.stat-detail"
        )!.textContent = `, ${ordinal}`;
      }
    }
  }

  // Update sum.
  const sum = statTile.querySelector(".value-sum"),
    sumValue =
      payLoad[
        `day${observation[0].toUpperCase()}${observation.slice(1)}_${unitMQTT}`
      ];

  if (sum && sumValue) {
    sum.querySelector(".stat-value")!.textContent = `${parseFloat(
      sumValue
    ).toFixed(rounding)}${unit}`;
  }

  // rainRate handling - rainRate is displayed in the rain tile.
  if (observation === "rain") {
    let rainRate: number | null = null;
    if (payLoad["rainRate_inch_per_hour"]) {
      rainRate = parseFloat(payLoad["rainRate_inch_per_hour"]);
    } else if (payLoad["rainRate_mm_per_hour"]) {
      rainRate = parseFloat(payLoad["rainRate_mm_per_hour"]);
    } else if (payLoad["rainRate_cm_per_hour"]) {
      rainRate = parseFloat(payLoad["rainRate_cm_per_hour"]);
    }

    // Ensure rainRate if reset in day change.
    if (dayChange && rainRate === null) {
      rainRate = 0;
    }

    if (rainRate === null) return;

    const rainRateUnit = statTile.getAttribute("data-unit-rain-rate")!;

    const rainRateCurrent = statTile.querySelector(".value-rain-rate-current"),
      rainRateMax = statTile.querySelector(".value-rain-rate-max"),
      rainRateMaxValue = rainRateMax
        ? rainRateMax!.querySelector(".stat-value span.value")!.innerHTML
        : "";

    if (rainRateCurrent) {
      rainRateCurrent.querySelector(
        ".stat-value span.value"
      )!.textContent = `${rainRate.toFixed(rounding)}${rainRateUnit}`;
    }

    if (rainRateMax && (rainRate > parseFloat(rainRateMaxValue) || dayChange)) {
      rainRateMax.querySelector(
        ".stat-value span.value"
      )!.textContent = `${rainRate.toFixed(rounding)}${rainRateUnit}`;
    }
  }
};

const _updateTableRow = (
  tableRow: HTMLElement,
  key: string,
  observation: string,
  unit: string,
  value: number,
  rounding: number,
  payLoad: any,
  dayChange: boolean
) => {
  // Update the main value.
  tableRow.querySelector(
    "bx-structured-list-cell.cell-value > span"
  )!.textContent = `${value}${unit}`;

  // For eg. the windDir arrows on the windSpeed and gustSpeed tiles.
  const tableRowDetail = tableRow.querySelector(
    "bx-structured-list-cell.cell-value .stat-detail"
  );

  // Re-append the detail.
  if (tableRowDetail) {
    if (
      (observation === "windSpeed" && !payLoad["windDir"]) ||
      (observation === "windGust" && !payLoad["windGustDir"])
    ) {
      (tableRowDetail as HTMLElement).style.display = "none";
    }
    if (
      (observation === "windSpeed" && payLoad["windDir"]) ||
      (observation === "windGust" && payLoad["windGustDir"])
    ) {
      (tableRowDetail as HTMLElement).style.display = "inline";
      const ordinal =
        ordinalCompass[
          Math.floor(
            parseInt(payLoad[dependentObs[observation]]) / 22.5 + 0.5
          ) % 16
        ];

      if (tableRowDetail) {
        tableRowDetail.textContent = `, ${ordinal}`;
      }
    }
  }

  // Update min/max.
  const min = tableRow.querySelector<HTMLElement>(
      "bx-structured-list-cell.cell-min"
    ),
    minValueSpan = tableRow.querySelector(
      "bx-structured-list-cell.cell-min > span"
    )!,
    minValue = minValueSpan.innerHTML;

  if (min && (payLoad[key] < parseFloat(minValue) || dayChange)) {
    minValueSpan.textContent = `${parseFloat(payLoad[key]).toFixed(
      rounding
    )}${unit}`;

    // Update min/max time if enabled.
    const time = min!.querySelector(".date");
    if (time) {
      time.textContent = dayjs.unix(payLoad.dateTime).format("HH:mm:ss");
    }

    // windDir.
    if (
      (observation === "windSpeed" && !payLoad["windDir"]) ||
      (observation === "windGust" && !payLoad["windGustDir"])
    ) {
      (
        min.querySelector(".stat-wind-dir.stat-detail") as HTMLElement
      ).style.display = "none";
    }
    if (
      (observation === "windSpeed" && payLoad["windDir"]) ||
      (observation === "windGust" && payLoad["windGustDir"])
    ) {
      (
        min.querySelector(".stat-wind-dir.stat-detail") as HTMLElement
      ).style.display = "inline";
      const ordinal =
        ordinalCompass[
          Math.floor(
            parseInt(payLoad[dependentObs[observation]]) / 22.5 + 0.5
          ) % 16
        ];

      if (min.querySelector(".stat-wind-dir.stat-detail")) {
        min.querySelector(
          ".stat-wind-dir.stat-detail"
        )!.textContent = `, ${ordinal}`;
      }
    }
  }

  const max = tableRow.querySelector("bx-structured-list-cell.cell-max"),
    maxValueSpan = tableRow.querySelector(
      "bx-structured-list-cell.cell-max > span"
    )!,
    maxValue = maxValueSpan.innerHTML;

  if (max && (payLoad[key] > parseFloat(maxValue) || dayChange)) {
    maxValueSpan.textContent = `${parseFloat(payLoad[key]).toFixed(
      rounding
    )}${unit}`;

    // Update min/max time if enabled.
    const time = max!.querySelector(".date");
    if (time) {
      time.textContent = dayjs.unix(payLoad.dateTime).format("HH:mm:ss");
    }

    // windDir.
    if (
      (observation === "windSpeed" && !payLoad["windDir"]) ||
      (observation === "windGust" && !payLoad["windGustDir"])
    ) {
      (
        max.querySelector(".stat-wind-dir.stat-detail") as HTMLElement
      ).style.display = "none";
    }
    if (
      (observation === "windSpeed" && payLoad["windDir"]) ||
      (observation === "windGust" && payLoad["windGustDir"])
    ) {
      (
        max.querySelector(".stat-wind-dir.stat-detail") as HTMLElement
      ).style.display = "inline";
      const ordinal =
        ordinalCompass[
          Math.floor(
            parseInt(payLoad[dependentObs[observation]]) / 22.5 + 0.5
          ) % 16
        ];

      if (max.querySelector(".stat-wind-dir.stat-detail")) {
        max.querySelector(
          ".stat-wind-dir.stat-detail"
        )!.textContent = `, ${ordinal}`;
      }
    }
  }
};

// Called when the client connects
const onConnect = () => {
  // Once a connection has been made, make a subscription and send a message.
  console.log("MQTT WS: onConnect Success.");
  console.log(`MQTT WS: Subscribing to topic ${mqtt_topic}...`);

  notfication!.setAttribute("kind", "success");
  notfication!.setAttribute("title", `Connected to live weather station.`);
  websiteMessageContainer!.style.display = "block";

  client.subscribe(mqtt_topic);
};

// Called when initial connection fails.
const onFailure = (error: any) => {
  console.log(
    `MQTT WS: onConnect Failure: ${error.errorMessage} (Error Code ${error.errorCode})`
  );

  notfication!.setAttribute("kind", "error");
  notfication!.setAttribute(
    "title",
    `Could not connect to live weather station.`
  );
  websiteMessageContainer!.style.display = "block";

  client.subscribe(mqtt_topic);
};

// called when the client loses its connection
const onConnectionLost = (responseObject: any) => {
  if (responseObject.errorCode !== 0) {
    console.log("MQTT WS: onConnectionLost:" + responseObject.errorMessage);

    notfication!.setAttribute("kind", "error");
    notfication!.setAttribute("title", `Connection lost.`);
  }
};

// Called when a message arrives from the broker.
const onMessageArrived = (message: Message) => {
  const payLoad = JSON.parse(message.payloadString);

  notfication!.setAttribute(
    "subtitle",
    `Last update was ${dayjs.unix(payLoad.dateTime).format("HH:mm:ss")}`
  );

  const lastGenerated_ts = (window as any).weewxWdcConfig.time,
    lastGenerated_formatted = dayjs
      .unix(parseInt(lastGenerated_ts))
      .format("YYYY-MM-DD");

  for (const key in payLoad) {
    if (["dateTime", "usUnits", "interval"].includes(key)) continue;

    const keySplitted = _splitMQTTProp(key);
    const observation = keySplitted[0];
    const unitMQTT = _getUnitFromMQTTProp(keySplitted);

    const lastUpdate_ts = localStorage.getItem(
        `weewx.weewx_wdc.mqtt-last-udpate-${key}`
      ),
      lastUpdate_formatted = lastUpdate_ts
        ? dayjs.unix(parseInt(lastUpdate_ts)).format("YYYY-MM-DD")
        : null;
    let dayChange = false;

    // Day changed, reset min/max/sum.
    if (
      lastUpdate_ts &&
      lastGenerated_formatted !==
        dayjs.unix(payLoad.dateTime).format("YYYY-MM-DD") &&
      lastUpdate_formatted !== dayjs.unix(payLoad.dateTime).format("YYYY-MM-DD")
    ) {
      dayChange = true;
    }

    localStorage.setItem(
      `weewx.weewx_wdc.mqtt-last-udpate-${key}`,
      payLoad.dateTime
    );

    // Alternative layout.
    const statTile = document.querySelector(
      `.stat-tile[data-observation="${observation}"]`
    );

    // Classic layout.
    const tableRow = document.querySelector(
      `.obs-stat-tile bx-structured-list-row[data-observation="${observation}"]`
    );

    const gaugeTile = document.querySelector(
      `.diagram-tile.gauge[data-observation="${observation}"]`
    );

    // TODO: Min/Max reset on day change not working.
    if (gaugeTile) {
      const gaugeTileSeriesName = gaugeTile.getAttribute("data-test")!;
      (window as any)[gaugeTileSeriesName].current = payLoad[key];

      // Respect day change.
      if (dayChange) {
        (window as any)[gaugeTileSeriesName].dayChange = true;
      }

      if (
        parseFloat(payLoad[key]) <
          parseFloat((window as any)[gaugeTileSeriesName].min) ||
        dayChange
      ) {
        (window as any)[gaugeTileSeriesName].min = payLoad[key];
      }

      if (
        parseFloat(payLoad[key]) >
          parseFloat((window as any)[gaugeTileSeriesName].max) ||
        dayChange
      ) {
        (window as any)[gaugeTileSeriesName].max = payLoad[key];
      }

      (window as any)[gaugeTileSeriesName].dayChange = false;
    }

    if (statTile) {
      const statTileUnit = statTile.getAttribute("data-unit")!;
      const statTileRounding =
        typeof statTile.getAttribute("data-rounding") === "string"
          ? parseInt(statTile.getAttribute("data-rounding")!)
          : 1;

      // Float or int? Do not use rounding on ints.
      const newValue =
        payLoad[key].toString().indexOf(".") != -1
          ? parseFloat(payLoad[key]).toFixed(statTileRounding)
          : payLoad[key];

      _updateStatTile(
        statTile as HTMLElement,
        key,
        observation,
        statTileUnit,
        newValue,
        statTileRounding,
        payLoad,
        unitMQTT,
        dayChange
      );
    }

    if (tableRow) {
      const tableRowUnit = tableRow.getAttribute("data-unit")!;
      const tableRowRounding =
        typeof tableRow.getAttribute("data-rounding") === "string"
          ? parseInt(tableRow.getAttribute("data-rounding")!)
          : 1;

      // Float or int? Do not use rounding on ints.
      const newValue =
        payLoad[key].toString().indexOf(".") != -1
          ? parseFloat(payLoad[key]).toFixed(tableRowRounding)
          : payLoad[key];

      if (tableRow.getAttribute("data-aggregation") === "sum") {
        if (
          payLoad[
            `day${
              observation.charAt(0).toUpperCase() + observation.slice(1)
            }_${unitMQTT}`
          ]
        ) {
          tableRow.querySelector(
            "bx-structured-list-cell.cell-value"
          )!.textContent = `${newValue}${tableRowUnit}`;
        }
      } else {
        _updateTableRow(
          tableRow as HTMLElement,
          key,
          observation,
          tableRowUnit,
          newValue,
          tableRowRounding,
          payLoad,
          dayChange
        );
      }
    }
  }
};

const client = new Client(
  mqtt_host,
  parseInt(mqtt_port, 10),
  "wewx-wdc-website-" + Math.floor(Math.random() * 999999999)
);

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({
  onSuccess: onConnect,
  onFailure: onFailure,
  useSSL: mqtt_ssl === "1",
  reconnect: true,
});
