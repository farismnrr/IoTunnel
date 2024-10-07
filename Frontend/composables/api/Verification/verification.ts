import axios from "axios";
import EncryptionManager from "@/composables/utils/encryption";
import type { VerificationResponse } from "@/composables/model";

class Verification {
    private readonly _apiUrl: string;
    private readonly _apiSecret: string;
    private readonly _encryptionManager: EncryptionManager;

    constructor(apiUrl: string, apiSecret: string, encryptionManager: EncryptionManager) {
        this._apiUrl = apiUrl;
        this._apiSecret = apiSecret;
        this._encryptionManager = encryptionManager;
    }

    async getUrlRegister(owner: string): Promise<string> {
        return `${this._apiUrl}/${owner}/otp/register`;
    }

    async getUrlReset(owner: string): Promise<string> {
        return `${this._apiUrl}/${owner}/otp/reset`;
    }

    async sendOtpUserRegister(email: string): Promise<VerificationResponse> {
        try {
            const url = await this.getUrlRegister("users");
            const response = await axios.post(
                url,
                {
                    email
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this._apiSecret}`
                    }
                }
            );
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as VerificationResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async sendOtpAdminRegister(email: string): Promise<VerificationResponse> {
        try {
            const url = await this.getUrlRegister("admins");
            const response = await axios.post(
                url,
                {
                    email
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this._apiSecret}`
                    }
                }
            );
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as VerificationResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async sendOtpUserReset(email: string): Promise<VerificationResponse> {
        try {
            const url = await this.getUrlReset("users");
            const response = await axios.post(
                url,
                {
                    email
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this._apiSecret}`
                    }
                }
            );
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as VerificationResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async sendOtpAdminReset(email: string): Promise<VerificationResponse> {
        try {
            const url = await this.getUrlReset("admins");
            const response = await axios.post(
                url,
                {
                    email
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this._apiSecret}`
                    }
                }
            );
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as VerificationResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }
}

export default Verification;
