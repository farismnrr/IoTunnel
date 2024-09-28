import axios from "axios";
import type { BaseResponse } from "@/composables/utils";
import type { AuthData } from "./models/types";

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

    private async getUrlEditAuth(owner: string): Promise<string> {
        return `${this.apiUrl}/${owner}/auth`;
    }

    private async getUrlLogoutAuth(owner: string): Promise<string> {
        return `${this.apiUrl}/${owner}/logout`;
    }

    async getAdminKey(): Promise<string> {
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
            return error.response.data;
        }
    }

    async EditAdminToken(refreshToken: string): Promise<any> {
        try {
            const url = await this.getUrlEditAuth("admins");
            const response = await axios.post(
                url,
                {
                    refresh_token: refreshToken
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
            return error.response.data;
        }
    }

    async EditUserToken(refreshToken: string): Promise<any> {
        try {
            const url = await this.getUrlEditAuth("users");
            const response = await axios.post(
                url,
                {
                    refresh_token: refreshToken
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
            return error.response.data;
        }
    }

    async DeleteAdminToken(refreshToken: string): Promise<BaseResponse> {
        try {
            const url = await this.getUrlLogoutAuth("admins");
            const response = await axios.post(
                url,
                {
                    refresh_token: refreshToken
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
            return error.response.data;
        }
    }

    async DeleteUserToken(refreshToken: string): Promise<BaseResponse> {
        try {
            const url = await this.getUrlLogoutAuth("users");
            const response = await axios.post(
                url,
                {
                    refresh_token: refreshToken
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
            return error.response.data;
        }
    }
}
