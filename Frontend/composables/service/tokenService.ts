import { toast, toastOptions } from "@/composables/utils/toast";
import { useAuthStore } from "@/stores/pinia";
import useToken from "@/composables/api/Token";
import type { Config } from "@/composables/model";

const TokenService = (config: Config, internalLink: string) => {
    const authStore = useAuthStore();
    const token = useToken(config);

    const updateUserToken = async () => {
        const response = await token.userTokenUpdate();
        switch (response.status) {
            case "fail":
                await token.userTokenDelete();
                authStore.deleteAccessTokenUser();
                navigateTo(internalLink);
                break;
            case "success":
                authStore.updateAccessTokenUser(response.data.access_token);
                break;
            default:
                toast.info("Unexpected response from server", toastOptions);
                authStore.deleteAccessTokenUser();
                navigateTo(internalLink);
        }
    };

    const updateAdminToken = async () => {
        const response = await token.adminTokenUpdate();
        switch (response.status) {
            case "fail":
                await token.adminTokenDelete();
                authStore.deleteAccessTokenAdmin();
                navigateTo(internalLink);
                break;
            case "success":
                authStore.updateAccessTokenAdmin(response.data.access_token);
                break;
            default:
                toast.info("Unexpected response from server", toastOptions);
                await token.adminTokenDelete();
                navigateTo(internalLink);
        }
    };

    const deleteUserToken = async () => {
        const response = await token.userTokenDelete();
        switch (response.status) {
            case "fail":
                toast.error(response.errors, toastOptions);
                break;
            case "success":
                authStore.deleteAccessTokenUser();
                navigateTo(internalLink);
                break;
            default:
                toast.info("Unexpected response from server", toastOptions);
                authStore.deleteAccessTokenUser();
                navigateTo(internalLink);
        }
    };

    const deleteAdminToken = async () => {
        const response = await token.adminTokenDelete();
        switch (response.status) {
            case "fail":
                toast.error(response.errors, toastOptions);
                break;
            case "success":
                authStore.deleteAccessTokenAdmin();
                navigateTo(internalLink);
                break;
            default:
                toast.info("Unexpected response from server", toastOptions);
                authStore.deleteAccessTokenAdmin();
                navigateTo(internalLink);
        }
    };

    return {
        updateUserToken: () => updateUserToken(),
        updateAdminToken: () => updateAdminToken(),
        deleteUserToken: () => deleteUserToken(),
        deleteAdminToken: () => deleteAdminToken()
    };
};

export default TokenService;
