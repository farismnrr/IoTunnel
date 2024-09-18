import ClientError from "./entities/client.error";
import NotFoundError from "./entities/notFound.error";
import ConflictError from "./entities/conflict.error";
import InvariantError from "./entities/invariant.error";
import ConnectionError from "./entities/connection.error";
import UnsupportedMediaTypeError from "./entities/media.error";
import AuthorizationError from "./entities/authorization.error";
import AuthenticationError from "./entities/authentication.error";

export {
	AuthenticationError,
	InvariantError,
	AuthorizationError,
	NotFoundError,
	ConnectionError,
	UnsupportedMediaTypeError,
	ConflictError
};
export default ClientError;
