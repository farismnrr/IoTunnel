#include "api.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>

HTTPClient http;

API::API() {
	_apiPort = 5000;
  _apiUrl = String("http://") + String(mqttBroker) + ":" + String(_apiPort) + "/api/v1/components/";
  _username = this->_username;
  _password = this->_password;
}

void API::getCredentials(const char* user, const char* password) {
  this->_username = user;
  this->_password = password;
}

String API::getTopic(WiFiClient client, const char* virtualPin) {
  int httpCode;
  String response;
  String auth = "Bearer " + String(this->_password);
  do {
    http.begin(client, this->_apiUrl + virtualPin);
    http.addHeader("Authorization", auth);
    httpCode = http.GET();
    response = http.getString();
    if (httpCode != 200) {
        Serial.println(response);
        Serial.println("Error sending request to API:");
        Serial.println(http.errorToString(httpCode));
        delay(2000);
    }
  } while (httpCode != 200);

  DynamicJsonDocument jsonDoc(2048);
  deserializeJson(jsonDoc, response);
  String topicId = jsonDoc["data"]["topic_id"];
	return topicId.c_str();
}

String API::apiUrl() {
	return this->_apiUrl;
}