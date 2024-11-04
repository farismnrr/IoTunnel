import axios from "axios";
import EncryptionManager from "@/composables/utils/encryption";
import type { ProductResponse } from "@/composables/model";

class Product {
    private readonly _apiUrl: string;
    private readonly _apiSecret: string;
    private readonly _encryptionManager: EncryptionManager;

    constructor(apiUrl: string, apiSecret: string, encryptionManager: EncryptionManager) {
        this._apiUrl = apiUrl;
        this._apiSecret = apiSecret;
        this._encryptionManager = encryptionManager;
    }

    private async getUrlProduct(): Promise<string> {
        return `${this._apiUrl}/products`;
    }

    async getProducts(): Promise<ProductResponse> {
        try {
            const url = await this.getUrlProduct();
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${this._apiSecret}`
                }
            });
            const data = await this._encryptionManager.decrypt(response.data as string);
            return data as ProductResponse;
        } catch (error: any) {
            return error.response.data;
        }
    }
}

export default Product;
