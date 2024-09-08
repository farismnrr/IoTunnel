#ifndef IoTunnel_h
#define IoTunnel_h

#include <Arduino.h>

class IoTunnel {
  public:
    void loop();
    void connectToWiFi(const char* ssid, const char* password);
    void getCredentials(const char* username, const char* password);
    int virtualPinControl(const char* virtualPin, int physicalPin);
    void virtualPinSetup(const char* virtualPin);
  private:
    String _topic;
    int _virtualPinValue;
    const char* _username;
    const char* _password;
    const char* _virtualPin;

    int virtualPinCallback(const char* virtualPin, const char* topic, byte *payload, unsigned int length);
};

#endif