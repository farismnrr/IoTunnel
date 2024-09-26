import axios from "axios";

export default class Auth {
    private readonly apiUrl: string;
    private readonly apiSecret: string;

    constructor(apiUrl: string, apiSecret: string) {
        this.apiUrl = apiUrl;
        this.apiSecret = apiSecret;
    }

    private async getUrlAdminKey(): Promise<string> {
        return `${this.apiUrl}/admins/key`;
    }

    private async getUrlAuth(owner: string): Promise<string> {
        return `${this.apiUrl}/${owner}/auth`;
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

    async EditAdminToken(): Promise<any> {
        try {
            const url = await this.getUrlAuth("admins");
            const response = await axios.put(url, {
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

    async EditUserToken(): Promise<any> {
        try {
            const url = await this.getUrlAuth("users");
            const response = await axios.put(url, {
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

    async DeleteAdminToken(): Promise<any> {
        try {
            const url = await this.getUrlAuth("admins");
            const response = await axios.delete(url, {
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

    async DeleteUserToken(): Promise<any> {
        try {
            const url = await this.getUrlAuth("users");
            const response = await axios.delete(url, {
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
