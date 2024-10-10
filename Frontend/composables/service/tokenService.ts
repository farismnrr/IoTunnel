import { toast, toastOptions } from "@/composables/utils/toast";
import { useAuthStore } from "@/stores/pinia";
import useToken from "@/composables/api/Token";
import type { Config, TokenResponse, BaseResponse } from "@/composables/model";

const TokenService = (internalLink: string, config: Config) => {
    const authStore = useAuthStore();
    const token = useToken(config);

    const handleTokenResponse = async (response: TokenResponse | BaseResponse, isAdmin: boolean, isUpdate: boolean) => {
        const { status } = response;
        const deleteToken = isAdmin ? token.adminTokenDelete : token.userTokenDelete;
        const deleteStoreToken = isAdmin ? authStore.deleteAccessTokenAdmin : authStore.deleteAccessTokenUser;
        const updateStoreToken = isAdmin ? authStore.updateAccessTokenAdmin : authStore.updateAccessTokenUser;

        switch (status) {
            case "fail":
                if (isUpdate) {
                    await deleteToken();
                    deleteStoreToken();
                    navigateTo(internalLink);
                } else {
                    toast.error("errors" in response ? response.errors : "Operation failed", toastOptions);
                }
                break;
            case "success":
                if (isUpdate && "data" in response && "access_token" in response.data) {
                    updateStoreToken(response.data.access_token);
                } else if (!isUpdate) {
                    deleteStoreToken();
                    navigateTo(internalLink);
                }
                break;
            default:
                toast.info("Unexpected response from server", toastOptions);
                if (isUpdate) {
                    await deleteToken();
                }
                deleteStoreToken();
                navigateTo(internalLink);
        }
    };

    const updateToken = async (updateFunction: () => Promise<TokenResponse>, isAdmin: boolean) => {
        try {
            const response = await updateFunction();
            await handleTokenResponse(response, isAdmin, true);
        } catch (error) {
            toast.error("An error occurred while updating token. Please try again later.", toastOptions);
            throw error;
        }
    };

    const deleteToken = async (deleteFunction: () => Promise<BaseResponse>, isAdmin: boolean) => {
        try {
            const response = await deleteFunction();
            await handleTokenResponse(response, isAdmin, false);
        } catch (error) {
            toast.error("An error occurred while deleting token. Please try again later.", toastOptions);
            throw error;
        }
    };

    return {
        updateUserToken: () => updateToken(token.userTokenUpdate, false),
        updateAdminToken: () => updateToken(token.adminTokenUpdate, true),
        deleteUserToken: () => deleteToken(token.userTokenDelete, false),
        deleteAdminToken: () => deleteToken(token.adminTokenDelete, true)
    };
};

export default TokenService;
