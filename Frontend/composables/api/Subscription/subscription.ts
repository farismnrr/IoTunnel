import axios from "axios";
import EncryptionManager from "@/composables/utils/encryption";
import type { GetSubscriptionResponse } from "@/composables/model";

class Subscription {
    private readonly _apiUrl: string;
    private readonly _apiSecret: string;
    private readonly _encryptionManager: EncryptionManager;

    constructor(apiUrl: string, apiSecret: string, encryptionManager: EncryptionManager) {
        this._apiUrl = apiUrl;
        this._apiSecret = apiSecret;
        this._encryptionManager = encryptionManager;
    }

    private async getUrlSubscription(): Promise<string> {
        return `${this._apiUrl}/subscriptions`;
    }

    async getSubscription(): Promise<GetSubscriptionResponse> {
        try {
            const url = await this.getUrlSubscription();
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${this._apiSecret}`
                }
            });
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as GetSubscriptionResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }
}

export default Subscription;
