import axios from "axios";
import type { ResponseOtp } from "./models/types";

export default class Otp {
    private readonly apiUrl: string;
    private readonly apiSecret: string;

    constructor(apiUrl: string, apiSecret: string) {
        this.apiUrl = apiUrl;
        this.apiSecret = apiSecret;
    }

    async getUrlSIgnin(owner: string): Promise<string> {
        const url = `${this.apiUrl}/${owner}/otp/register`;
        return url;
    }

    async sendOtpUser(email: string): Promise<ResponseOtp> {
        try {
            const owner = "users";
            const url = await this.getUrlSIgnin(owner);
            const response = await axios.post(
                url,
                {
                    email
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

    async sendOtpAdmin(email: string): Promise<ResponseOtp> {
        try {
            const owner = "admins";
            const url = await this.getUrlSIgnin(owner);
            const response = await axios.post(
                url,
                {
                    email
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
