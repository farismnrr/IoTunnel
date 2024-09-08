#ifndef IoTunnel_h
#define IoTunnel_h

#include <Arduino.h>

class IoTunnel {
  public:
    void loop();
    void connectToWiFi(const char* ssid, const char* password);
    void connectToMQTT(const char* username, const char* password);
    void getCredentials(const char* username, const char* password);
    const char* getTopic(const char* virtualPin);
  private:
    String _topic;
};

#endif