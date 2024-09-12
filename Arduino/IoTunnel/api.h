#ifndef api_h
#define api_h

#include <Arduino.h>
#include <WiFi.h>

class API {
  public:
  	API();
    void getCredentials(const char* user, const char* password);
    String getTopic(WiFiClient client, const char* virtualPin);
    String apiUrl();

    const char* mqttBroker = "34.1.199.101";
    int mqttPort = 1883;
    int apiPort = 5499;
  private:
    String _apiUrl;
    const char* _username;
    const char* _password;
};

#endif