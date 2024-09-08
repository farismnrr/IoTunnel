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

void IoTunnel::getCredentials(const char* username, const char* password) {
  api.getCredentials(username, password);
  this->_username = username;
  this->_password = password;
}

void IoTunnel::connectToWiFi(const char* ssid, const char* password) {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the Wi-Fi network");
}

void IoTunnel::virtualPinSetup(const char* virtualPin) {
  // Konfigurasi MQTT
  client.setServer(api.mqttBroker, api.mqttPort);

  // Mendapatkan topik dari API
  String topic = api.getTopic(espClient, virtualPin);
  this->_topic = topic;

  // Menghubungkan ke MQTT
  String clientId = "esp32-client-" + String(this->_username) + String(WiFi.macAddress());
  while (!client.connected()) {
    Serial.printf("Klien %s menghubungkan ke broker MQTT\n", clientId.c_str());
    if (!client.connect(clientId.c_str(), this->_username, this->_password)) {
      Serial.print("Gagal dengan status ");
      Serial.print(client.state());
      delay(2000);
    } else {
      Serial.println("Broker MQTT terhubung");
      client.publish(this->_topic.c_str(), "ESP32 Terhubung ke MQTT");
      client.subscribe(this->_topic.c_str());
    }
  }
}