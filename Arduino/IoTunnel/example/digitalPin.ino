#include "IoTunnel.h"

IoTunnel tunnel;

const char *ssid = "";
const char *password = "";
const char *mqtt_username = "";
const char *mqtt_password = "";
const char *virtualPin = "";
const char *projectId = "";
const int ledPin = 2;

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  tunnel.connectToWiFi(ssid, password);
  tunnel.getCredentials(mqtt_username, mqtt_password);
  tunnel.getTopics(projectId, virtualPin);
  tunnel.virtualPinSetup();
}

void loop() {
  tunnel.loop();

  int pin = tunnel.virtualPinControl(virtualPin);
  if (pin == 1) {
    digitalWrite(ledPin, HIGH);
  } else if (pin == 0) {
    digitalWrite(ledPin, LOW);
  }
}