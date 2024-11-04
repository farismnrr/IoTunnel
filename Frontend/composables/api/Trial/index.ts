import Trial from "./trial";
import EncryptionManager from "@/composables/utils/encryption";
import type { Config, GetTrialResponse, BaseResponse } from "@/composables/model";

interface TrialInterface {
    getTrial: () => Promise<GetTrialResponse>;
    updateTrial: () => Promise<BaseResponse>;
}

const useTrial = (config: Config, accessToken: string): TrialInterface => {
    const encryptionManager = new EncryptionManager(config.public.privateKey, config.public.publicKey);
    const trial = new Trial(config.public.apiUrl, accessToken, encryptionManager);

    return {
        getTrial: () => trial.getTrial(),
        updateTrial: () => trial.updateTrial()
    };
};

export default useTrial;
