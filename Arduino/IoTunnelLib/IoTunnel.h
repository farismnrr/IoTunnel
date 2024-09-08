#ifndef IoTunnel_h
#define IoTunnel_h

class IoTunnel {
  public:
    const char* getBroker();
    int getPort();
    void connectToWiFi(const char* ssid, const char* password);
};

#endif