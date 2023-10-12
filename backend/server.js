// server.js
const mqtt = require("mqtt");
const express = require("express");
// http and ws modules are part of the Node.js standard library
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const MQTT_BROKER_URL = "mqtt://example.mqtt-broker.com"; // add your broker here
const MQTT_TOPIC = "mqtt-receiver";

const mqttClient = mqtt.connect(MQTT_BROKER_URL);

mqttClient.on("connect", () => {
  mqttClient.subscribe(MQTT_TOPIC);
  console.log("Connected to the broker");
});

mqttClient.on("message", (topic, message) => {
  console.log(message.toString("utf-8"));
  const payload = message.toString();
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
});

server.listen(5001, () => {
  console.log("Server is running on port 5001");
});
