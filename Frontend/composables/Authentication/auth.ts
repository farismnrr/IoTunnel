import axios from "axios";

export default class Auth {
    private readonly apiUrl: string;
    private readonly apiSecret: string;

    constructor(apiUrl: string, apiSecret: string) {
        this.apiUrl = apiUrl;
        this.apiSecret = apiSecret;
    }

    private async getUrlAdminKey(): Promise<string> {
        const url = `${this.apiUrl}/admins/key`;
        return url;
    }

    private async getUrlAuth(owner: string): Promise<string> {
        const url = `${this.apiUrl}/${owner}/auth`;
        return url;
    }

    async getAdminKey(): Promise<any> {
        try {
            const url = await this.getUrlAdminKey();
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiSecret}`
                }
            });
            return response.data.data.admin_key;
        } catch (error: any) {
            const response = error.response;
            return response.data;
        }
    }

    async EditAdminToken(token: string): Promise<any> {
        try {
            const url = await this.getUrlAuth("admins");
            const response = await axios.put(
                url,
                {
                    refresh_token: token
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apiSecret}`
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            const response = error.response;
            return response.data;
        }
    }

    async EditUserToken(token: string): Promise<any> {
        try {
            const url = await this.getUrlAuth("users");
            const response = await axios.put(
                url,
                {
                    refresh_token: token
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apiSecret}`
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            const response = error.response;
            return response.data;
        }
    }
}
