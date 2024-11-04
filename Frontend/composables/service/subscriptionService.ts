import { toast, toastOptions } from "@/composables/utils/toast";
import { useAuthStore } from "@/stores/pinia";
import useSubscription from "@/composables/api/Subscription";
import TokenService from "./tokenService";
import type { Config, GetSubscriptionResponse, BaseResponse, SubscriptionData } from "@/composables/model";

const SubscriptionService = (internalLink: string, config: Config) => {
    const authStore = useAuthStore();
    const accessToken = authStore.getAccessTokenUser();
    const { getSubscription } = useSubscription(config, accessToken);
    const tokenService = TokenService(internalLink, config);

    const handleSubscriptionResponse = async (response: GetSubscriptionResponse | BaseResponse): Promise<void> => {
        const { status, errors } = response;

        switch (status) {
            case "fail":
                if (errors && errors.includes("Token maximum age exceeded")) {
                    await tokenService.updateUserToken();
                }
                break;
            case "success":
                break;
            default:
                toast.info("Unexpected response from server", toastOptions);
        }
    };

    const fetchSubscription = async (): Promise<SubscriptionData> => {
        try {
            const response = await getSubscription();
            await handleSubscriptionResponse(response);
            return response.data;
        } catch (error) {
            toast.error("An error occurred while fetching subscription data. Please try again later.", toastOptions);
            throw error;
        }
    };

    return {
        getSubscription: () => fetchSubscription()
    };
};

export default SubscriptionService;
