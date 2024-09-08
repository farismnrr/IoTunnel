#ifndef IoTunnel_h
#define IoTunnel_h

#include <Arduino.h>

class IoTunnel {
  public:
    void loop();
    void connectToWiFi(const char* ssid, const char* password);
    void getCredentials(const char* username, const char* password);
    int virtualPinControl(const char* virtualPin, int physicalPin);
    void getTopics(const char* virtualPin);
    void virtualPinSetup();
  private:
    String _topics[10];
    int _virtualPinValues[10];
    const char* _username;
    const char* _password;
    const char* _virtualPins[10];

    int virtualPinCallback(const char* topic, byte *payload, unsigned int length);
};

#endif