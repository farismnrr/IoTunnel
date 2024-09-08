#ifndef IoTunnel_h
#define IoTunnel_h

class IoTunnel {
  public:
    void loop();
    void connectToWiFi(const char* ssid, const char* password);
    void connectToMQTT(const char* username, const char* password);

    const char *topic = "LED";
};

#endif