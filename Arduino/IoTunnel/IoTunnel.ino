#include "IoTunnel.h"

IoTunnel tunnel;

const char *ssid = "MDK NEW";
const char *password = "13141157";
const char *mqtt_username = "user-_LQgOkC8Wz-1725768867080";
const char *mqtt_password = "key-7VWrZ5WYufMMUIb8-trial-4Kxv3iPDpwy1rYjZ-p-8J0-1725768878693";

void setup() {
  Serial.begin(115200);
  tunnel.connectToWiFi(ssid, password);
  tunnel.connectToMQTT(mqtt_username, mqtt_password);
}

void loop() {
  tunnel.loop();
}