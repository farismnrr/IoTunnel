interface Config {
    public: {
        apiSecret: string;
        apiUrl: string;
    };
}

interface BaseResponse {
    status: string;
    message: string;
}

export type { Config, BaseResponse };
