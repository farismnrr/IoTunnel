import axios from "axios";
import EncryptionManager from "@/composables/utils/encryption";
import useCookie from "@/composables/api/Cookie";
import type {
    UserRegistrationData,
    AdminRegistrationData,
    UserLoginData,
    AdminLoginData,
    AuthenticationResponse
} from "@/composables/model";
class Verification {
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

    async getUrlSignup(owner: string): Promise<string> {
        return `${this._apiUrl}/${owner}`;
    }

    async getUrlSignin(owner: string): Promise<string> {
        return `${this._apiUrl}/${owner}/login`;
    }

    async userRegister(payload: UserRegistrationData): Promise<AuthenticationResponse> {
        try {
            const url = await this.getUrlSignup("users");
            const response = await axios.post(url, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this._apiSecret}`
                }
            });
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as AuthenticationResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async adminRegister(payload: AdminRegistrationData): Promise<AuthenticationResponse> {
        try {
            const url = await this.getUrlSignup("admins");
            const response = await axios.post(url, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this._apiSecret}`
                }
            });
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as AuthenticationResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async userLogin(payload: UserLoginData): Promise<AuthenticationResponse> {
        try {
            const url = await this.getUrlSignin("users");
            const response = await axios.post(url, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this._apiSecret}`
                }
            });
            await this._cookie.setCookie(response.data, "user");
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as AuthenticationResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async adminLogin(payload: AdminLoginData): Promise<AuthenticationResponse> {
        try {
            const url = await this.getUrlSignin("admins");
            const response = await axios.post(url, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this._apiSecret}`
                }
            });
            await this._cookie.setCookie(response.data, "admin");
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as AuthenticationResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }
}

export default Verification;
