#include "IoTunnel.h"

IoTunnel tunnel;

const char *ssid = "";
const char *password = "";
const char *mqtt_username = "";
const char *mqtt_password = "";
const char *virtualPin = "";
const char *virtualPin2 = "";
const char *projectId = "";

const int ledPin = 13;
const int ledPin2 = 12;

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  tunnel.connectToWiFi(ssid, password);
  tunnel.getCredentials(mqtt_username, mqtt_password);
  tunnel.getTopics(projectId, virtualPin);
  tunnel.getTopics(projectId, virtualPin2);
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

  int pin2 = tunnel.virtualPinControl(virtualPin2);
  if (pin2 == 1) {
    digitalWrite(ledPin2, HIGH);
  } else if (pin2 == 0) {
    digitalWrite(ledPin2, LOW);
  }
}