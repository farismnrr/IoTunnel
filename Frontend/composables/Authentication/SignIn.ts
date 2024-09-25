import axios from "axios";
import { formatSigninAdmin } from "./models/mapping";
import type {
    SigninUser,
    FormattedSigninAdmin,
    ResponseSigninUser,
    ResponseSigninAdmin
} from "./models/types";

export default class Signin {
    private readonly apiUrl: string;
    private readonly apiSecret: string;

    constructor(apiUrl: string, apiSecret: string) {
        this.apiUrl = apiUrl;
        this.apiSecret = apiSecret;
    }

    private async getUrlSIgnin(owner: string): Promise<string> {
        const url = `${this.apiUrl}/${owner}/login`;
        return url;
    }

    async signinUser(user: SigninUser): Promise<ResponseSigninUser> {
        try {
            const url = await this.getUrlSIgnin("users");
            const response = await axios.post(url, user, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiSecret}`
                }
            });
            // TODO: response.data.data.refresh_token <== store in http Only cookie
            return response.data;
        } catch (error: any) {
            const response = error.response;
            return response.data;
        }
    }

    async signinAdmin(admin: FormattedSigninAdmin): Promise<ResponseSigninAdmin> {
        try {
            const url = await this.getUrlSIgnin("admins");
            const formattedAdmin = formatSigninAdmin(admin);
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
