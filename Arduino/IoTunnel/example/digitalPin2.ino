#include "IoTunnel.h"

IoTunnel tunnel;

const char *ssid = "MDK NEW";
const char *password = "13141157";
const char *mqtt_username = "user-_LQgOkC8Wz-1725768867080";
const char *mqtt_password = "key-7VWrZ5WYufMMUIb8-trial-4Kxv3iPDpwy1rYjZ-p-8J0-1725768878693";
const char *virtualPin = "VIRTUAL_DIGITAL_PIN_1";
const char *virtualPin2 = "VIRTUAL_DIGITAL_PIN_2";
const char *projectId = "project-oJ30vvO5LRBKzik5";

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