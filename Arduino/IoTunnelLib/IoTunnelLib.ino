#include "IoTunnel.h"
#include <WiFi.h>
#include <PubSubClient.h>

IoTunnel tunnel;

const char *ssid = "MDK NEW";
const char *password = "13141157";

int port;
const char *broker;
const char *topic = "LED";
const char *mqtt_username = "user-_LQgOkC8Wz-1725768867080";
const char *mqtt_password = "key-7VWrZ5WYufMMUIb8-trial-4Kxv3iPDpwy1rYjZ-p-8J0-1725768878693";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  tunnel.connectToWiFi(ssid, password);
  getBroker();
  connectToMQTT();
}

void loop() {
  client.loop();
}

void getBroker() {
  broker = tunnel.getBroker();
  port = tunnel.getPort();
}

void connectToMQTT() {
  client.setServer(broker, port);
  while (!client.connected()) {
    String client_id = "esp32-client-farismnrr";
    client_id += String(WiFi.macAddress());
    Serial.printf("The client %s connects to the public MQTT broker\n", client_id.c_str());
    if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("Public EMQX MQTT broker connected");
    } else {
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }
  // Publish and subscribe
  client.publish(topic, "ESP32 Connected to MQTT");
  client.subscribe(topic);
}