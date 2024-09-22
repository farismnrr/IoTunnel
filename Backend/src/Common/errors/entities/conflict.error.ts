import ClientError from "./client.error";

class ConflictError extends ClientError {
    constructor(message: string = "Conflict") {
        super(message, 409);
        this.name = "ConflictError";
    }
}

export default ConflictError;
