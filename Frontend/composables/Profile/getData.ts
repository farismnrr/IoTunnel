import axios from "axios";

export default class GetData {
    private readonly apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async getUrlProfile(owner: string): Promise<string> {
        return `${this.apiUrl}/${owner}`;
    }

    async getUserProfile(accessToken: string): Promise<any> {
        try {
            const url = await this.getUrlProfile("users");
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async getAdminProfile(accessToken: string): Promise<any> {
        try {
            const url = await this.getUrlProfile("admins");
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }
}
