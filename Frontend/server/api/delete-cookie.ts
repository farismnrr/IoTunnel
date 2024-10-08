import { defineEventHandler, setCookie, getCookie } from "h3";
import { Buffer } from "buffer";

// Function to decode base64
const decodeBase64 = (str: string | null): string | null => {
    if (!str) return null;
    return Buffer.from(str, "base64").toString("utf-8");
};

export default defineEventHandler(event => {
    const refreshTokenUser = getCookie(event, "refreshTokenUser");
    const refreshTokenAdmin = getCookie(event, "refreshTokenAdmin");

    if (refreshTokenUser) {
        decodeBase64(refreshTokenUser);
        setCookie(event, "refreshTokenUser", "", {
            maxAge: 0,
            httpOnly: true,
            path: "/",
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });
    }

    if (refreshTokenAdmin) {
        decodeBase64(refreshTokenAdmin);
        setCookie(event, "refreshTokenAdmin", "", {
            maxAge: 0,
            httpOnly: true,
            path: "/",
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });
    }
});
