import axios from "axios";

export default class GetData {
    private readonly apiUrl: string;
    private readonly apiSecret: string;

    constructor(apiUrl: string, apiSecret: string) {
        this.apiUrl = apiUrl;
        this.apiSecret = apiSecret;
    }

    async getUrlProfile(owner: string): Promise<string> {
        return `${this.apiUrl}/${owner}`;
    }

    async getUserProfile(): Promise<any> {
        try {
            const url = await this.getUrlProfile("users");
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiSecret}`
                }
            });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async getAdminProfile(): Promise<any> {
        try {
            const url = await this.getUrlProfile("admins");
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiSecret}`
                }
            });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }
}
