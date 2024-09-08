#ifndef IoTunnel_h
#define IoTunnel_h

#include <Arduino.h>

class IoTunnel {
  public:
    void loop();
    void connectToWiFi(const char* ssid, const char* password);
    void getCredentials(const char* username, const char* password);
    void virtualPinSetup(const char* virtualPin);
  private:
    String _topic;
    const char* _username;
    const char* _password;
};

#endif