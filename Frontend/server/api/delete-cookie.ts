import { defineEventHandler, setCookie, getCookie, readBody, createError } from "h3";
import { Buffer } from "buffer";

const decodeBase64 = (str: string | null): string | null => {
    if (!str) return null;
    return Buffer.from(str, "base64").toString("utf-8");
};

export default defineEventHandler(async event => {
    const { token, role } = await readBody(event);

    if (!token || !role) {
        throw createError({
            statusCode: 400,
            statusMessage: "Token and role are required in the request body"
        });
    }

    if (role !== "user" && role !== "admin") {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid role. Must be 'user' or 'admin'"
        });
    }

    const cookieName = `refreshToken${role.charAt(0).toUpperCase() + role.slice(1)}`;
    const existingToken = getCookie(event, cookieName);
    const decodedExistingToken = decodeBase64(existingToken as string);

    if (!existingToken || decodedExistingToken !== token) {
        throw createError({
            statusCode: 400,
            statusMessage: "Token not found or doesn't match"
        });
    }

    setCookie(event, cookieName, "", {
        maxAge: 0,
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
    });
});
