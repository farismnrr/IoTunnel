#include "IoTunnel.h"
#include "api.h"
#include <WiFi.h>

API api;

const char* IoTunnel::getBroker() {
  return api.mqttBroker;
}

int IoTunnel::getPort() {
  return api.mqttPort;
}

void IoTunnel::connectToWiFi(const char* ssid, const char* password) {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the Wi-Fi network");
}