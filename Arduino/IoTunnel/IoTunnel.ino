#include "IoTunnel.h"

IoTunnel tunnel;

const char *ssid = "MDK NEW";
const char *password = "13141157";
const char *mqtt_username = "user-W2wAv_rKby-1727001995509";
const char *mqtt_password = "key-J1Xrqp4KGLpgrw_U-trial-DhDy9O4eUFenfPZi-wmevS-1727002011343";
const char *virtualPin = "VIRTUAL_DIGITAL_PIN_1";
const char *virtualPin2 = "VIRTUAL_DIGITAL_PIN_3";
const char *projectId = "project-wL75p5ZufI-jPdbp";

const int ledPin = 2;
const int ledPin2 = 26;

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