import axios from "axios";

class Cookie {
    constructor() {}

    async setCookie(refresh_token: string, role: string): Promise<void> {
        try {
            if (role !== "user" && role !== "admin") {
                throw new Error("Invalid role. Must be 'user' or 'admin'");
            }
            await axios.post(`/api/set-cookie`, { refresh_token, role });
        } catch (error: any) {
            console.error("Error setting cookie:", error.response?.data || error.message);
            throw error;
        }
    }

    async getCookie(): Promise<{ userToken: string | null; adminToken: string | null }> {
        try {
            const response = await axios.get(`/api/get-cookie`);
            return {
                userToken: response.data.userToken,
                adminToken: response.data.adminToken
            };
        } catch (error: any) {
            console.error("Error getting cookie:", error.response?.data || error.message);
            throw error;
        }
    }

    async deleteCookie(token: string, role: string): Promise<void> {
        try {
            await axios.post(`/api/delete-cookie`, { token, role });
        } catch (error: any) {
            console.error("Error deleting cookie:", error.response?.data || error.message);
            throw error;
        }
    }
}

export default Cookie;
