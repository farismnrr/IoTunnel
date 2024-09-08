#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// WiFi
const char *ssid = "MDK NEW"; // Enter your Wi-Fi name
const char *password = "13141157";  // Enter Wi-Fi password

// MQTT Broker
const char *mqtt_broker = "34.142.222.2";
const char *topic = "LED";
const char *mqtt_username = "user-_LQgOkC8Wz-1725768867080";
const char *mqtt_password = "key-7VWrZ5WYufMMUIb8-trial-4Kxv3iPDpwy1rYjZ-p-8J0-1725768878693";
const int mqtt_port = 1883;

int ledPin = 13;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  // Set software serial baud to 115200;
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  // Connecting to a WiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the Wi-Fi network");
  //connecting to a mqtt broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  while (!client.connected()) {
    String client_id = "esp32-client-farismnrr";
    client_id += String(WiFi.macAddress());
    Serial.printf("The client %s connects to the public MQTT broker\n", client_id.c_str());
    if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("Public EMQX MQTT broker connected");
    } else {
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }
  // Publish and subscribe
  client.publish(topic, "Hi, I'm ESP32 ^^");
  client.subscribe(topic);
}

void callback(char *topic, byte *payload, unsigned int length) {
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);

  // Create a JSON document
  DynamicJsonDocument jsonDoc(length);

  // Parse the JSON payload
  deserializeJson(jsonDoc, payload, length);

  // Check if the key "LED" exists in the JSON document
  if (jsonDoc.containsKey("data")) {
    int ledValue = jsonDoc["data"];

    if (ledValue == 1) { 
      digitalWrite(ledPin, HIGH);
      Serial.print("LED Message: 1");
    } else if (ledValue == 0) {
      digitalWrite(ledPin, LOW);
      Serial.print("LED Message: 0");
    }
  } else {
    Serial.println("Error: LED key not found in JSON message");
  }
}

void loop() {
  client.loop();
}