#include "IoTunnel.h"

IoTunnel tunnel;

const char *ssid = "";
const char *password = "";
const char *mqtt_username = "";
const char *mqtt_password = "";
const char *virtualPin = "";
const char *virtualPin2 = "";
const char *projectId = "";

const int ledPin = 12;
const int ledPin2 = 13;
const int potentioPin = 34;

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  pinMode(potentioPin, INPUT);
  tunnel.connectToWiFi(ssid, password);
  tunnel.getCredentials(mqtt_username, mqtt_password);
  tunnel.getTopics(projectId, virtualPin);
  tunnel.getTopics(projectId, virtualPin2);
  tunnel.virtualPinSetup();

}

void loop() {
  tunnel.loop();

  int readValue = analogRead(potentioPin);
  int potentioValue = tunnel.virtualPinMonitor(virtualPin2, readValue);
  analogWrite(ledPin2, potentioValue);
  delay(2000);
  
  int ledValue = tunnel.virtualPinControl(virtualPin);
  if (ledValue == 1) {
    digitalWrite(ledPin, HIGH);
  } else if (ledValue == 0) {
    digitalWrite(ledPin, LOW);
  }
}