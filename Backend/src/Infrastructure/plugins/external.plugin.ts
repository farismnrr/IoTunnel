/* eslint-disable @typescript-eslint/no-explicit-any */
import Jwt from "@hapi/jwt";
import * as Hapi from "@hapi/hapi";
import Config from "../settings/config";
import Cookie from "@hapi/cookie";

const ExternalPlugins = async (server: Hapi.Server) => {
    await server.register([
        {
            plugin: Jwt
        },
        {
            plugin: Cookie
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

    const sessionOptionsUser = {
        cookie: {
            name: "refreshTokenUser",
            isSecure: false,
            isHttpOnly: true,
            isSameSite: "Strict",
            path: "/",
            ttl: Config.timeOut.cookie,
            password: Config.jwt.refreshTokenKey
        },
        validate: async () => {
            return { isValid: true };
        },
        requestDecoratorName: "userCookieAuth"
    };

    const sessionOptionsAdmin = {
        cookie: {
            name: "refreshTokenAdmin",
            isSecure: false,
            isHttpOnly: true,
            isSameSite: "Strict",
            path: "/",
            ttl: Config.timeOut.cookie,
            password: Config.jwt.refreshTokenKey
        },
        validate: async () => {
            return { isValid: true };
        },
        requestDecoratorName: "adminCookieAuth"
    };

    server.auth.strategy("admin_jwt", "jwt", adminJwtOptions);
    server.auth.strategy("user_jwt", "jwt", userJwtOptions);
    server.auth.strategy("user_session", "cookie", sessionOptionsUser);
    server.auth.strategy("admin_session", "cookie", sessionOptionsAdmin);
};

export default ExternalPlugins;
