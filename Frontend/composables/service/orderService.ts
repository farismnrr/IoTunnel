import { toast, toastOptions } from "@/composables/utils/toast";
import { useAuthStore } from "@/stores/pinia";
import useOrder from "@/composables/api/Order";
import TokenService from "./tokenService";
import type {
    Config,
    GetOrderResponse,
    CreateOrderResponse,
    BaseResponse,
    CreateOrderResult
} from "@/composables/model";
import { navigateTo } from "#app";

const OrderService = (internalLink: string, config: Config) => {
    const authStore = useAuthStore();
    const accessToken = authStore.getAccessTokenUser();
    const order = useOrder(config, accessToken);
    const tokenService = TokenService(internalLink, config);

    const handleOrderResponse = async (
        response: GetOrderResponse | CreateOrderResponse | BaseResponse,
        isGetOrder: boolean
    ): Promise<void> => {
        const { status, errors } = response;

        switch (status) {
            case "fail":
                if (errors && errors.includes("Token maximum age exceeded")) {
                    await tokenService.updateUserToken();
                } else {
                    toast.error(errors, toastOptions);
                }
                break;
            case "success":
                if (isGetOrder) {
                    navigateTo(internalLink);
                }
                break;
            default:
                toast.info("Unexpected response from server", toastOptions);
        }
    };

    const getOrder = async (getOrderFunction: () => Promise<GetOrderResponse>): Promise<GetOrderResponse> => {
        try {
            const response = await getOrderFunction();
            await handleOrderResponse(response, true);
            return response;
        } catch (error) {
            toast.error("An error occurred while fetching order data. Please try again later.", toastOptions);
            throw error;
        }
    };

    const createOrder = async (createOrderFunction: () => Promise<CreateOrderResponse>): Promise<CreateOrderResult> => {
        try {
            const response = await createOrderFunction();
            await handleOrderResponse(response, false);
            return response.data;
        } catch (error) {
            toast.error("An error occurred while creating the order. Please try again later.", toastOptions);
            throw error;
        }
    };

    return {
        getOrder: (orderId: string) => getOrder(() => order.getOrder(orderId)),
        createOrder: (productId: string) => createOrder(() => order.createOrder(productId))
    };
};

export default OrderService;
