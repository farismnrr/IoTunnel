const config = {
    mosquitto: {
        apiUrl: process.env.API_ENDPOINT,
    },
    server: {
        port: process.env.PORT,
        host: process.env.HOST,
        key: process.env.SERVER_KEY,
    },
};

export default config;
