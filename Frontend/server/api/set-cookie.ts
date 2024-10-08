import { defineEventHandler, readBody, setCookie, createError } from "h3";
import { Buffer } from "buffer";

// fungsi untuk encode base64
const encodeBase64 = (str: string) => {
    return Buffer.from(str).toString("base64");
};

export default defineEventHandler(async event => {
    const maxAge = 30 * 24 * 60 * 60; 
    const body = await readBody(event);
    const { refresh_token, role } = body;

    if (!refresh_token || !role) {
        throw createError({
            statusCode: 400,
            statusMessage: "Refresh_token and role are required in the request body"
        });
    }

    if (role !== "user" && role !== "admin") {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid role. Must be 'user' or 'admin'"
        });
    }

    const encodedRefreshToken = encodeBase64(refresh_token);
    const cookieName = role === "user" ? "refreshTokenUser" : "refreshTokenAdmin";
    setCookie(event, cookieName, encodedRefreshToken, {
        maxAge,
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
    });
});
