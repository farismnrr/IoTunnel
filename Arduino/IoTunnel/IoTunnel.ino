#include "IoTunnel.h"

IoTunnel tunnel;

const char *ssid = "MDK NEW";
const char *password = "13141157";
const char *mqtt_username = "user-rz8wV-FMTp-1726983363122";
const char *mqtt_password = "key-SugwfPsWhM5ZakD--trial-09pHqFyTMm6fFovA-7dyz0-1726983375417";
const char *virtualPin = "VIRTUAL_DIGITAL_PIN_1";
const char *projectId = "project-uq9GcVZKX6Ri-zVX";
const int ledPin = 26;

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

  int pin = tunnel.virtualPinControl(projectId, virtualPin);
  if (pin == 1) {
    digitalWrite(ledPin, HIGH);
  } else if (pin == 0) {
    digitalWrite(ledPin, LOW);
  }
}