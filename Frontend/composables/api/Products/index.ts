import Product from "./product";
import EncryptionManager from "@/composables/utils/encryption";
import type { Config, ProductResponse } from "@/composables/model";

interface ProductInterface {
    getProducts: () => Promise<ProductResponse>;
}

const useProduct = (config: Config): ProductInterface => {
    const encryptionManager = new EncryptionManager(config.public.privateKey, config.public.publicKey);
    const product = new Product(config.public.apiUrl, config.public.apiSecret, encryptionManager);

    return {
        getProducts: () => product.getProducts()
    };
};

export default useProduct;