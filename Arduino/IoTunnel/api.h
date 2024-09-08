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

    const char* mqttBroker = "34.142.222.2";
    int mqttPort = 1883;
  private:
    String _apiUrl;
		int _apiPort;
    const char* _username;
    const char* _password;
};

#endif