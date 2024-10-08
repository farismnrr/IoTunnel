import { defineEventHandler, getCookie } from "h3";
import { Buffer } from "buffer";

// Function to decode base64
const decodeBase64 = (str: string | null): string | null => {
    if (!str) return null;
    return Buffer.from(str, "base64").toString("utf-8");
};

export default defineEventHandler(event => {
    const refreshTokenUser = getCookie(event, "refreshTokenUser");
    const refreshTokenAdmin = getCookie(event, "refreshTokenAdmin");

    if (!refreshTokenUser && !refreshTokenAdmin) {
        return {
            message: "No refresh token found",
            userToken: null,
            adminToken: null
        };
    }

    return {
        userToken: decodeBase64(refreshTokenUser as string),
        adminToken: decodeBase64(refreshTokenAdmin as string)
    };
});
