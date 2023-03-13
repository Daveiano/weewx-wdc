console.log("ja");

const client = new Paho.MQTT.Client(
  "34.240.27.55",
  9001,
  "wewx-wdc-website-" + Math.floor(Math.random() * 999999999)
);

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({ onSuccess: onConnect });

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("weather/loop");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived:");
  console.log(message);
  console.log(message.destinationName);
  console.log(JSON.parse(message.payloadString));
}
