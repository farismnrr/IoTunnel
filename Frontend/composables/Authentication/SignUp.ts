import axios from "axios";
import { formatSignupUser, formatSignupAdmin } from "./models/mapping";
import type {
    FormattedSignupUser,
    FormattedSignupAdmin,
    ResponseSignupUser,
    ResponseSignupAdmin
} from "./models/types";

export default class Signup {
    private readonly apiUrl: string;
    private readonly apiSecret: string;

    constructor(apiUrl: string, apiSecret: string) {
        this.apiUrl = apiUrl;
        this.apiSecret = apiSecret;
    }

    private async getUrlSignup(owner: string): Promise<string> {
        return `${this.apiUrl}/${owner}`;
    }

    async signupUser(user: FormattedSignupUser): Promise<ResponseSignupUser> {
        try {
            const url = await this.getUrlSignup("users");
            const formattedUser = formatSignupUser(user);
            const response = await axios.post(url, formattedUser, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiSecret}`
                }
            });
            return response.data;
        } catch (error: any) {
            const response = error.response;
            return response.data;
        }
    }

    async signupAdmin(admin: FormattedSignupAdmin): Promise<ResponseSignupAdmin> {
        try {
            const url = await this.getUrlSignup("admins");
            const formattedAdmin = formatSignupAdmin(admin);
            const response = await axios.post(url, formattedAdmin, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiSecret}`
                }
            });
            return response.data;
        } catch (error: any) {
            const response = error.response;
            return response.data;
        }
    }
}
