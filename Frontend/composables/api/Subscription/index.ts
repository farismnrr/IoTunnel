import Subscription from "./subscription";
import EncryptionManager from "@/composables/utils/encryption";
import type { Config, GetSubscriptionResponse } from "@/composables/model";

interface SubscriptionInterface {
    getSubscription: () => Promise<GetSubscriptionResponse>;
}

const useSubscription = (config: Config, accessToken: string): SubscriptionInterface => {
    const encryptionManager = new EncryptionManager(config.public.privateKey, config.public.publicKey);
    const subscription = new Subscription(config.public.apiUrl, accessToken, encryptionManager);

    return {
        getSubscription: () => subscription.getSubscription()
    };
};

export default useSubscription;
