#include "IoTunnel.h"

IoTunnel tunnel;

const char *ssid = "MDK NEW";
const char *password = "13141157";
const char *mqtt_username = "user-_LQgOkC8Wz-1725768867080";
const char *mqtt_password = "key-7VWrZ5WYufMMUIb8-trial-4Kxv3iPDpwy1rYjZ-p-8J0-1725768878693";
const char *virtualPin = "VIRTUAL_ANALOG_PIN_1";

const int analogPin = 34;

void setup() {
  Serial.begin(115200);
  pinMode(analogPin, INPUT);
  tunnel.connectToWiFi(ssid, password);
  tunnel.getCredentials(mqtt_username, mqtt_password);
  tunnel.getTopics(virtualPin);
  tunnel.virtualPinSetup();
}

void loop() {
  tunnel.loop();

  int analogValue = analogRead(analogPin);
  int potentioValue = tunnel.virtualPinMonitor(virtualPin, analogValue);
  Serial.println(analogValue);
  delay(2000);
}