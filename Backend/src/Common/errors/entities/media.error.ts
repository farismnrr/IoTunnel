import ClientError from "./client.error";

class UnsupportedMediaTypeError extends ClientError {
    constructor(message = "Unsupported media type") {
        super(message, 415);
        this.name = "UnsupportedMediaTypeError";
    }
}

export default UnsupportedMediaTypeError;
