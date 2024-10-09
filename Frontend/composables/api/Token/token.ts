import axios from "axios";
import EncryptionManager from "@/composables/utils/encryption";
import useCookie from "../Cookie";
import type { TokenResponse, BaseResponse } from "@/composables/model";

class Token {
    private readonly _apiUrl: string;
    private readonly _apiSecret: string;
    private readonly _encryptionManager: EncryptionManager;
    private readonly _cookie: ReturnType<typeof useCookie>;

    constructor(apiUrl: string, apiSecret: string, encryptionManager: EncryptionManager) {
        this._apiUrl = apiUrl;
        this._apiSecret = apiSecret;
        this._encryptionManager = encryptionManager;
        this._cookie = useCookie();
    }

    async getUrlTokenUpdate(owner: string): Promise<string> {
        return `${this._apiUrl}/${owner}/auth`;
    }

    async getUrlTokenDelete(owner: string): Promise<string> {
        return `${this._apiUrl}/${owner}/logout`;
    }

    async getCookie(): Promise<{ userToken: string | null; adminToken: string | null }> {
        return this._cookie.getCookie();
    }

    async deleteCookie(cookie: string, role: string): Promise<void> {
        return this._cookie.deleteCookie(cookie, role);
    }

    async userTokenUpdate(): Promise<TokenResponse> {
        try {
            const { userToken } = await this.getCookie();
            if (!userToken) {
                throw new Error("User refresh token not found");
            }
            const url = await this.getUrlTokenUpdate("users");
            const response = await axios.post(url, userToken, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this._apiSecret}`
                }
            });
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as TokenResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async adminTokenUpdate(): Promise<TokenResponse> {
        try {
            const { adminToken } = await this.getCookie();
            if (!adminToken) {
                throw new Error("Admin refresh token not found");
            }
            const url = await this.getUrlTokenUpdate("admins");
            const response = await axios.post(url, adminToken, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this._apiSecret}`
                }
            });
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as TokenResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async userTokenDelete(): Promise<BaseResponse> {
        try {
            const { userToken } = await this.getCookie();
            if (!userToken) {
                throw new Error("User refresh token not found");
            }
            const url = await this.getUrlTokenDelete("users");
            const response = await axios.post(url, userToken, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this._apiSecret}`
                }
            });
            await this.deleteCookie(userToken, "user");
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as BaseResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async adminTokenDelete(): Promise<BaseResponse> {
        try {
            const { adminToken } = await this.getCookie();
            if (!adminToken) {
                throw new Error("Admin refresh token not found");
            }
            const url = await this.getUrlTokenDelete("admins");
            const response = await axios.post(url, adminToken, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this._apiSecret}`
                }
            });
            await this.deleteCookie(adminToken, "admin");
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as BaseResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }
}

export default Token;
