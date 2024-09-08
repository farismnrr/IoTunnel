#include "IoTunnel.h"

IoTunnel tunnel;

const char *ssid = "MDK NEW";
const char *password = "13141157";
const char *mqtt_username = "user-sGc-hN9GfA-1725816050240";
const char *mqtt_password = "key-VVrfdrAoF09Prwta-trial-ZjXDC1kQD_7g5XNx-gf8wp-1725816075793";
const char *virtualPin = "VIRTUAL_DIGITAL_PIN_1";

const int ledPin = 13;

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  tunnel.connectToWiFi(ssid, password);
  tunnel.getCredentials(mqtt_username, mqtt_password);
  tunnel.getTopics(virtualPin);
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