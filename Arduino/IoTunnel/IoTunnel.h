#ifndef IoTunnel_h
#define IoTunnel_h

#include <Arduino.h>

class IoTunnel {
  public:
    void loop();
    void virtualPinSetup();
    void getTopics(const char* projectId, const char* virtualPin);
    void connectToWiFi(const char* ssid, const char* password);
    void getCredentials(const char* username, const char* password);
    int virtualPinControl(const char* virtualPin);
    int virtualPinMonitor(const char* virtualPin, int valuePin);
  private:
    String _topics[10];
    int _virtualPinValues[10];
    const char* _username;
    const char* _password;
    const char* _virtualPins[10];
    const char* _projectId[10];

    int _limitIndex = 10;

    int virtualPinCallback(const char* topic, byte *payload, unsigned int length);
};

#endif