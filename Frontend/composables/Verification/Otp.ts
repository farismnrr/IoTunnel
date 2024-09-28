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
        return `${this.apiUrl}/${owner}/otp/register`;
    }

    async sendOtpUser(email: string): Promise<ResponseOtp> {
        try {
            const url = await this.getUrlSIgnin("users");
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
            return error.response.data;
        }
    }

    async sendOtpAdmin(email: string): Promise<ResponseOtp> {
        try {
            const url = await this.getUrlSIgnin("admins");
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
            return error.response.data;
        }
    }
}
