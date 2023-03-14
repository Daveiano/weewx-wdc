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

const getUnitFromMQTTProp = (keySplitted: string[]) => {
  let unitMQTT = undefined;

  if (keySplitted.length > 1) {
    keySplitted.shift();
    unitMQTT = keySplitted.join("_");
  }

  return unitMQTT;
};

// called when the client connects
const onConnect = () => {
  // Once a connection has been made, make a subscription and send a message.
  console.log("MQTT WS: onConnect Success.");
  console.log(`MQTT WS: Subscribing to topic ${mqtt_topic}...`);

  notfication!.setAttribute("kind", "success");
  notfication!.setAttribute("title", `Connected to live weather station.`);
  websiteMessageContainer!.style.display = "block";

  client.subscribe(mqtt_topic);
};

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

// called when a message arrives
const onMessageArrived = (message: Message) => {
  const payLoad = JSON.parse(message.payloadString);

  notfication!.setAttribute(
    "subtitle",
    `Last update was ${dayjs.unix(payLoad.dateTime).format("h:mm:ss A")}`
  );

  for (const key in payLoad) {
    if (["dateTime", "usUnits", "interval"].includes(key)) continue;

    const keySplitted = key.split("_");
    const observation = keySplitted[0];
    const unitMQTT = getUnitFromMQTTProp(keySplitted);

    const statTile = document.querySelector(
      `.stat-tile[data-observation="${observation}"]`
    );

    if (!statTile) continue;

    const statTileUnit = statTile.getAttribute("data-unit");
    const statTileRounding =
      typeof statTile.getAttribute("data-rounding") === "string"
        ? parseInt(statTile.getAttribute("data-rounding")!)
        : 1;

    // Float or int? Do not use rounding on ints.
    const newValue =
      payLoad[key].toString().indexOf(".") != -1
        ? parseFloat(payLoad[key]).toFixed(statTileRounding)
        : payLoad[key];

    // For eg. the windDir arrows on the windSpeed and gustSpeed tiles.
    const statTileDetail = statTile.querySelector(
      ".stat-title-obs-value .stat-detail"
    );

    // Update the main value.
    statTile.querySelector(
      ".stat-title-obs-value .raw"
    )!.innerHTML = `${newValue}${statTileUnit}`;

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
    const min = statTile.querySelector(".value-min .stat-value");
    if (min && payLoad[key] < parseFloat(min.innerHTML)) {
      min.innerHTML = `${parseFloat(payLoad[key]).toFixed(
        statTileRounding
      )}${statTileUnit}`;
    }

    const max = statTile.querySelector(".value-max .stat-value");
    if (max && payLoad[key] > parseFloat(max.innerHTML)) {
      max.innerHTML = `${parseFloat(payLoad[key]).toFixed(
        statTileRounding
      )}${statTileUnit}`;
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
