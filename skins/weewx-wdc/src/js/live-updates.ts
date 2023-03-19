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
  unitMQTT: string
) => {
  // Update the main value.
  statTile.querySelector(
    ".stat-title-obs-value .raw"
  )!.innerHTML = `${value}${unit}`;

  // For eg. the windDir arrows on the windSpeed and gustSpeed tiles.
  const statTileDetail = statTile.querySelector(
    ".stat-title-obs-value .stat-detail"
  );

  // Re-append the detail.
  if (statTileDetail) {
    if (
      (observation === "windSpeed" || observation === "windGust") &&
      payLoad["windDir"]
    ) {
      const ordinal =
        ordinalCompass[
          Math.floor(parseInt(payLoad["windDir"]) / 22.5 + 0.5) % 16
        ];

      if (statTile.querySelector(".stat-title-obs-value .stat-detail")) {
        statTile.querySelector(
          ".stat-title-obs-value .stat-detail .value-detail"
        )!.textContent = ordinal;
      }

      (
        statTile.querySelector(
          ".stat-title-obs-value .stat-detail svg"
        ) as HTMLElement
      ).style.transform = `rotate(${parseInt(payLoad["windDir"]) + 90}deg)`;
    }
  }

  // Update min/max if available.
  // @todo WindDir for min/max.
  const min = statTile.querySelector(".value-min"),
    minValue = min
      ? min!.querySelector(".stat-value span.value")!.innerHTML
      : "";

  if (min && payLoad[key] < parseFloat(minValue)) {
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
      (observation === "windSpeed" || observation === "windGust") &&
      payLoad["windDir"]
    ) {
      const ordinal =
        ordinalCompass[
          Math.floor(parseInt(payLoad["windDir"]) / 22.5 + 0.5) % 16
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

  if (max && payLoad[key] > parseFloat(maxValue)) {
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
      (observation === "windSpeed" || observation === "windGust") &&
      payLoad["windDir"]
    ) {
      const ordinal =
        ordinalCompass[
          Math.floor(parseInt(payLoad["windDir"]) / 22.5 + 0.5) % 16
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
    ).toFixed(rounding)}${unit} !!!`;
  }
};

const _updateTableRow = (
  tableRow: HTMLElement,
  key: string,
  observation: string,
  unit: string,
  value: number,
  rounding: number,
  payLoad: any
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
      (observation === "windSpeed" || observation === "windGust") &&
      payLoad["windDir"]
    ) {
      const ordinal =
        ordinalCompass[
          Math.floor(parseInt(payLoad["windDir"]) / 22.5 + 0.5) % 16
        ];

      if (
        tableRow.querySelector(
          "bx-structured-list-cell.cell-value .stat-detail"
        )
      ) {
        tableRow.querySelector(
          "bx-structured-list-cell.cell-value .stat-detail"
        )!.textContent = `, ${ordinal}`;
      }
    }
  }

  // Update min/max.
  const min = tableRow.querySelector("bx-structured-list-cell.cell-min"),
    minValueSpan = tableRow.querySelector(
      "bx-structured-list-cell.cell-min > span"
    )!,
    minValue = minValueSpan.innerHTML;

  if (min && payLoad[key] < parseFloat(minValue)) {
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
      (observation === "windSpeed" || observation === "windGust") &&
      payLoad["windDir"]
    ) {
      const ordinal =
        ordinalCompass[
          Math.floor(parseInt(payLoad["windDir"]) / 22.5 + 0.5) % 16
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
  if (max && payLoad[key] > parseFloat(maxValue)) {
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
      (observation === "windSpeed" || observation === "windGust") &&
      payLoad["windDir"]
    ) {
      const ordinal =
        ordinalCompass[
          Math.floor(parseInt(payLoad["windDir"]) / 22.5 + 0.5) % 16
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
const onFailure = () => {
  // Once a connection has been made, make a subscription and send a message.
  console.log("MQTT WS: onConnect Failure.");

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

  // @todo Respect loop vs archive for totals (aggregation).
  console.log(message.destinationName);
  console.log(payLoad);

  notfication!.setAttribute(
    "subtitle",
    `Last update was ${dayjs.unix(payLoad.dateTime).format("HH:mm:ss")}`
  );

  for (const key in payLoad) {
    if (["dateTime", "usUnits", "interval"].includes(key)) continue;

    const keySplitted = key.split("_");
    const observation = keySplitted[0];
    const unitMQTT = _getUnitFromMQTTProp(keySplitted);

    // Alternative layout.
    const statTile = document.querySelector(
      `.stat-tile[data-observation="${observation}"]`
    );

    // Classic layout.
    const tableRow = document.querySelector(
      `.obs-stat-tile bx-structured-list-row[data-observation="${observation}"]`
    );

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
        unitMQTT
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
          payLoad
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
