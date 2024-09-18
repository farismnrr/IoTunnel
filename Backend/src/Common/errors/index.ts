import AuthenticationError from "./entities/authentication.error";
import InvariantError from "./entities/invariant.error";
import AuthorizationError from "./entities/authorization.error";
import ConnectionError from "./entities/connection.error";
import ClientError from "./entities/client.error";
import UnsupportedMediaTypeError from "./entities/media.error";
import NotFoundError from "./entities/notFound.error";

export { AuthenticationError, InvariantError, AuthorizationError, NotFoundError, ConnectionError, UnsupportedMediaTypeError };
export default ClientError;
