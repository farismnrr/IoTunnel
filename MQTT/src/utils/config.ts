const config = {
    mosquitto: {
        apiUrl: process.env.API_ENDPOINT,
    },
    server: {
        port: process.env.PORT,
        host: process.env.HOST,
    }
}

export default config;