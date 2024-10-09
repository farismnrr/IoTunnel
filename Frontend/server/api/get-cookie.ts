import { defineEventHandler, getCookie, createError } from "h3";
import { Buffer } from "buffer";

const decodeBase64 = (str: string | null): string | null => {
    if (!str) return null;
    return Buffer.from(str, "base64").toString("utf-8");
};

export default defineEventHandler(event => {
    const refreshTokenUser = getCookie(event, "refreshTokenUser");
    const refreshTokenAdmin = getCookie(event, "refreshTokenAdmin");

    if (!refreshTokenUser && !refreshTokenAdmin) {
        throw createError({
            statusCode: 400,
            statusMessage: "No refresh token found"
        });
    }

    return {
        userToken: decodeBase64(refreshTokenUser as string),
        adminToken: decodeBase64(refreshTokenAdmin as string)
    };
});
