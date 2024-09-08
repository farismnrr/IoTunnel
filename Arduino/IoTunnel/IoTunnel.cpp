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

void IoTunnel::getTopics(const char* virtualPin) {
  int idx = -1;
  for (int i = 0; i < 10; i++) {
    if (_topics[i] == "") {
      idx = i;
      break;
    }
  }
  if (idx != -1) {
    String topic = api.getTopic(espClient, virtualPin);
    _topics[idx] = topic;
    _virtualPins[idx] = virtualPin;
  }
}

void IoTunnel::virtualPinSetup() {
  // Konfigurasi MQTT
  client.setServer(api.mqttBroker, api.mqttPort);
  client.setCallback([this](const char* topic, byte *payload, unsigned int length) {
    this->virtualPinCallback(topic, payload, length);
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
      for (int i = 0; i < 10; i++) {
        if (_topics[i] != "") {
          client.publish(_topics[i].c_str(), "ESP32 Terhubung ke MQTT");
          client.subscribe(_topics[i].c_str());
        }
      }
    }
  }
}

int IoTunnel::virtualPinCallback(const char* topic, byte *payload, unsigned int length) {
  DynamicJsonDocument jsonDoc(length);
  deserializeJson(jsonDoc, payload, length);

  if (jsonDoc.containsKey("data")) {
    int value = jsonDoc["data"];
    for (int i = 0; i < 10; i++) {
      if (_topics[i] == topic) {
        _virtualPinValues[i] = value;
        return value;
      }
    }
  }
  return -1;
}

int IoTunnel::virtualPinControl(const char* virtualPin) {
  for (int i = 0; i < 10; i++) {
    if (_virtualPins[i] == virtualPin) {
      return _virtualPinValues[i];
    }
  }
  return -1;
}

int IoTunnel::virtualPinMonitor(const char* virtualPin, int valuePin) {
  for (int i = 0; i < 10; i++) {
    if (_virtualPins[i] == virtualPin) {
      DynamicJsonDocument jsonDoc(1024);
      jsonDoc["data"] = valuePin;
      String payload = jsonDoc.as<String>();
      client.publish(_topics[i].c_str(), payload.c_str());
      return _virtualPinValues[i] = valuePin;
    }
  }
  return -1;
}