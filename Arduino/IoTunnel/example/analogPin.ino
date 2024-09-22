#include "IoTunnel.h"

IoTunnel tunnel;

const char *ssid = "";
const char *password = "";
const char *mqtt_username = "";
const char *mqtt_password = "";
const char *virtualPin = "";
const char *projectId = "";
const int analogPin = 34;

void setup() {
  Serial.begin(115200);
  pinMode(analogPin, INPUT);
  tunnel.connectToWiFi(ssid, password);
  tunnel.getCredentials(mqtt_username, mqtt_password);
  tunnel.getTopics(projectId, virtualPin);
  tunnel.virtualPinSetup();
}

void loop() {
  tunnel.loop();

  int analogValue = analogRead(analogPin);
  int potentioValue = tunnel.virtualPinMonitor(virtualPin, analogValue);
  Serial.println(analogValue);
  delay(2000);
}