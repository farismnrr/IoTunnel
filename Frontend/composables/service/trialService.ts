import { toast, toastOptions } from "@/composables/utils/toast";
import { useAuthStore } from "@/stores/pinia";
import useTrial from "@/composables/api/Trial";
import TokenService from "./tokenService";
import type { Config, GetTrialResponse, BaseResponse, TrialData } from "@/composables/model";

const TrialService = (internalLink: string, config: Config) => {
    const authStore = useAuthStore();
    const accessToken = authStore.getAccessTokenUser();
    const trial = useTrial(config, accessToken);
    const tokenService = TokenService(internalLink, config);

    const handleTrialResponse = async (response: GetTrialResponse | BaseResponse): Promise<boolean> => {
        const { status, errors } = response;
        let isOpen = false;

        switch (status) {
            case "fail":
                if (errors && errors.includes("Trial already used")) {
                    toast.error("Trial already used. Please upgrade to a paid plan.", toastOptions);
                } else if (errors && errors.includes("Token maximum age exceeded")) {
                    await tokenService.updateUserToken();
                } else {
                    toast.error(errors, toastOptions);
                }
                isOpen = true;
                break;
            case "success":
                isOpen = false;
                break;
            default:
                toast.info("Unexpected response from server", toastOptions);
        }
        return isOpen;
    };

    const getTrial = async (getTrialFunction: () => Promise<GetTrialResponse>): Promise<TrialData> => {
        try {
            const response = await getTrialFunction();
            await handleTrialResponse(response);
            return response.data.trial;
        } catch (error) {
            toast.error("An error occurred while fetching trial data. Please try again later.", toastOptions);
            throw error;
        }
    };

    const updateTrial = async (updateTrialFunction: () => Promise<BaseResponse>): Promise<boolean> => {
        try {
            const response = await updateTrialFunction();
            const isOpen = await handleTrialResponse(response);
            return isOpen;
        } catch (error) {
            toast.error("An error occurred while updating trial. Please try again later.", toastOptions);
            throw error;
        }
    };

    return {
        getTrial: () => getTrial(trial.getTrial),
        updateTrial: () => updateTrial(trial.updateTrial)
    };
};

export default TrialService;
