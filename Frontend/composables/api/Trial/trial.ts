import axios from "axios";
import EncryptionManager from "@/composables/utils/encryption";
import type { BaseResponse, GetTrialResponse } from "@/composables/model";

class Trial {
    private readonly _apiUrl: string;
    private readonly _apiSecret: string;
    private readonly _encryptionManager: EncryptionManager;

    constructor(apiUrl: string, apiSecret: string, encryptionManager: EncryptionManager) {
        this._apiUrl = apiUrl;
        this._apiSecret = apiSecret;
        this._encryptionManager = encryptionManager;
    }

    private async getUrlTrial(): Promise<string> {
        return `${this._apiUrl}/trials`;
    }

    async getTrial(): Promise<GetTrialResponse> {
        try {
            const url = await this.getUrlTrial();
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${this._apiSecret}`
                }
            });
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as GetTrialResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async updateTrial(): Promise<BaseResponse> {
        try {
            const url = await this.getUrlTrial();
            const response = await axios.put(url, {}, {
                headers: {
                    Authorization: `Bearer ${this._apiSecret}`
                }
            });
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as BaseResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }
}

export default Trial;
