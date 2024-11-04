import axios from "axios";
import EncryptionManager from "@/composables/utils/encryption";
import type { GetOrderResponse, CreateOrderResponse } from "@/composables/model";

class Order {
    private readonly _apiUrl: string;
    private readonly _apiSecret: string;
    private readonly _encryptionManager: EncryptionManager;

    constructor(apiUrl: string, apiSecret: string, encryptionManager: EncryptionManager) {
        this._apiUrl = apiUrl;
        this._apiSecret = apiSecret;
        this._encryptionManager = encryptionManager;
    }

    private async getUrlOrder(id: string): Promise<string> {
        return `${this._apiUrl}/orders/${id}`;
    }

    async getOrder(orderId: string): Promise<GetOrderResponse> {
        try {
            const url = await this.getUrlOrder(orderId);
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${this._apiSecret}`
                }
            });
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as GetOrderResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async createOrder(productId: string): Promise<CreateOrderResponse> {
        try {
            const url = await this.getUrlOrder(productId);
            const response = await axios.post(
                url,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${this._apiSecret}`
                    }
                }
            );
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as CreateOrderResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }
}

export default Order;
