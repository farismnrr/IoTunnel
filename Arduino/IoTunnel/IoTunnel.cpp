#include "IoTunnel.h"
#include "api.h"
#include <WiFi.h>
#include <PubSubClient.h>

API api;
WiFiClient espClient;
PubSubClient client(espClient);

void IoTunnel::loop() {
  client.loop();
}

void IoTunnel::connectToWiFi(const char* ssid, const char* password) {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the Wi-Fi network");
}

void IoTunnel::connectToMQTT(const char* username, const char* password) {
  client.setServer(api.mqttBroker, api.mqttPort);
  
  while (!client.connected()) {
    String client_id = "esp32-client-" + String(username);
    client_id += String(WiFi.macAddress());
    Serial.printf("The client %s connects to the MQTT broker\n", client_id.c_str());

    if (client.connect(client_id.c_str(), username, password)) {
      Serial.println("MQTT broker connected");
    } else {
      Serial.print("failed with state ");
      Serial.print(client.state());
    }
  }

  client.publish(topic, "ESP32 Connected to MQTT");
  client.subscribe(topic);
}