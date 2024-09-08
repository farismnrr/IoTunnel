#include "IoTunnel.h"
#include "api.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

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

  client.setCallback([this, virtualPin](const char* topic, byte *payload, unsigned int length) {
    this->virtualPinCallback(virtualPin, topic, payload, length);
  });

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

int IoTunnel::virtualPinCallback(const char* virtualPin, const char* topic, byte *payload, unsigned int length) {
  DynamicJsonDocument jsonDoc(length);
  deserializeJson(jsonDoc, payload, length);

  if (jsonDoc.containsKey("data")) {
    int value = jsonDoc["data"];
    this->_virtualPin = virtualPin;
    this->_virtualPinValue = value;
    return value;
  }
}

int IoTunnel::virtualPinControl(const char* virtualPin, int physicalPin) {
  if (this->_virtualPin == virtualPin) {
    return this->_virtualPinValue;
  }
  return -1;
}
