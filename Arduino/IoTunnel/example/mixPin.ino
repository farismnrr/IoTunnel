#include "IoTunnel.h"

IoTunnel tunnel;

const char *ssid = "MDK NEW";
const char *password = "13141157";
const char *mqtt_username = "user-_LQgOkC8Wz-1725768867080";
const char *mqtt_password = "key-7VWrZ5WYufMMUIb8-trial-4Kxv3iPDpwy1rYjZ-p-8J0-1725768878693";
const char *virtualPin = "VIRTUAL_DIGITAL_PIN_1";
const char *virtualPin2 = "VIRTUAL_ANALOG_PIN_1";
const char *projectId = "project-oJ30vvO5LRBKzik5";

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