import { defineEventHandler, readBody, setCookie, createError } from "h3";
import { Buffer } from "buffer";

const encodeBase64 = (str: string): string => Buffer.from(str).toString("base64");

export default defineEventHandler(async (event) => {
    const maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
    const { refresh_token, role } = await readBody(event);

    if (!refresh_token || !role) {
        throw createError({
            statusCode: 400,
            statusMessage: "Refresh token and role are required in the request body"
        });
    }

    if (role !== "user" && role !== "admin") {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid role. Must be 'user' or 'admin'"
        });
    }

    const encodedRefreshToken = encodeBase64(refresh_token);
    const cookieName = `refreshToken${role.charAt(0).toUpperCase() + role.slice(1)}`;

    setCookie(event, cookieName, encodedRefreshToken, {
        maxAge,
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
    });
});
