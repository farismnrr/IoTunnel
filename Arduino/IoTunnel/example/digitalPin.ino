#include "IoTunnel.h"

IoTunnel tunnel;

const char *ssid = "Galaxy A51 16E8";
const char *password = "kkhc9039";
const char *mqtt_username = "user-gdgwerflfV-1725850125135";
const char *mqtt_password = "key-YOl3Yx_R6TpIKwer-trial-MwWpxKkgFQrCrYYn-4gOkF-1725850148061";
const char *virtualPin = "VIRTUAL_DIGITAL_PIN_1";
const char *projectId = "project-oJ30vvO5LRBKzik5";
const int ledPin = 13;

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