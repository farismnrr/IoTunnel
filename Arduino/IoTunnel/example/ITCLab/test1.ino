/*************************************
 * Program : Pengujian Kit iTCLab 1
 * Menggunakan Kit iTCLab
 * Oleh : Tim io-t.net
 * Surabaya, 10 April 2022
 * ***********************************/

#include <Arduino.h>
#include "IoTunnel.h"

#define T1       34
#define T2       35
#define LED      26
#define Q1       32
#define Q2       33

float cel, cel1, degC, degC1;
const float batas_suhu_atas = 55;

const char *ssid = "";
const char *password = "";
const char *mqtt_username = "";
const char *mqtt_password = "";
const char *virtualPin = "";
const char *projectId = "";

IoTunnel tunnel;

void setup() {
  Serial.begin(115200);
  tunnel.connectToWiFi(ssid, password);
  tunnel.getCredentials(mqtt_username, mqtt_password);
  tunnel.getTopics(projectId, virtualPin);
  tunnel.virtualPinSetup();
}

void Q1on(){
  analogWrite(Q1, 341);
}

void Q1off(){
  analogWrite(Q1, 0);
}

void Q2on(){
  analogWrite(Q2, 341);
}

void Q2off(){
  analogWrite(Q2, 0);
}

void ledon(){
  analogWrite(LED, 1023);
}

void ledoff(){
  analogWrite(LED, 0);
}

void cektemp(){
  degC = analogRead(T1) * 0.322265625;
  cel = degC/10;
  degC1 = analogRead(T2) * 0.322265625;
  cel1 = degC1/10;

  tunnel.virtualPinMonitor(virtualPin, cel);
  Serial.print("Temperature: ");
  Serial.print(cel);
  Serial.print("Â°C");
  Serial.print("  ~  ");
  Serial.print(cel1);
  Serial.println("Â°C");
}

void loop() {
  tunnel.loop();
  cektemp();
  if (cel > batas_suhu_atas){
    Q1off();
    ledon();
  }
  else {
    Q1on();
    ledoff();
  }
  if (cel1 > batas_suhu_atas){
    Q2off();
    ledon();
  }
  else {
    Q2on();
    ledoff();
  }
  
  delay (100);
}