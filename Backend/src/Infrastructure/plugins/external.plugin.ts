/* eslint-disable @typescript-eslint/no-explicit-any */
import Jwt from "@hapi/jwt";
import * as Hapi from "@hapi/hapi";
import Config from "../settings/config";

const ExternalPlugins = async (server: Hapi.Server) => {
	await server.register([
		{
			plugin: Jwt
		}
	]);

	const adminJwtOptions = {
		keys: Config.jwt.accessTokenKey,
		verify: {
			aud: false,
			iss: false,
			sub: false,
			maxAgeSec: Config.jwt.accessTokenAge
		},
		validate: (payload: any) => ({
			isValid: true,
			credentials: {
				id: payload.decoded.payload.id,
				role: "admin"
			}
		})
	};

	const userJwtOptions = {
		keys: Config.jwt.accessTokenKey,
		verify: {
			aud: false,
			iss: false,
			sub: false,
			maxAgeSec: Config.jwt.accessTokenAge
		},
		validate: (payload: any) => ({
			isValid: true,
			credentials: {
				id: payload.decoded.payload.id,
				role: "user"
			}
		})
	};

	server.auth.strategy("admin_jwt", "jwt", adminJwtOptions);
	server.auth.strategy("user_jwt", "jwt", userJwtOptions);
};

export default ExternalPlugins;
