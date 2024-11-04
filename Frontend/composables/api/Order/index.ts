import Order from "./order";
import EncryptionManager from "@/composables/utils/encryption";
import type { Config, GetOrderResponse, CreateOrderResponse } from "@/composables/model";

interface OrderInterface {
    getOrder: (orderId: string) => Promise<GetOrderResponse>;
    createOrder: (productId: string) => Promise<CreateOrderResponse>;
}

const useOrder = (config: Config, accessToken: string): OrderInterface => {
    const encryptionManager = new EncryptionManager(config.public.privateKey, config.public.publicKey);
    const order = new Order(config.public.apiUrl, accessToken, encryptionManager);

    return {
        getOrder: (orderId: string) => order.getOrder(orderId),
        createOrder: (productId: string) => order.createOrder(productId)
    };
};

export default useOrder;
