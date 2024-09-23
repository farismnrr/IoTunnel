import ClientError from "./client.error";

class ConnectionError extends ClientError {
    constructor(message: string) {
        super(message, 500);
        this.name = "ConnectionError";
    }
}

export default ConnectionError;
