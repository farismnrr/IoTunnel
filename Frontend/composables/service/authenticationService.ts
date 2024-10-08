import { toast, toastOptions } from "@/composables/utils/toast";
import { useAuthStore } from "@/stores/pinia";
import useAuthentication from "@/composables/api/Authentication";
import type { Config } from "@/composables/model";
import type {
    AdminRegistrationData,
    UserRegistrationData,
    UserLoginData,
    AdminLoginData,
    AuthenticationResponse
} from "@/composables/model";

const AuthenticationService = (externalLinks: string, config: Config) => {
    const authStore = useAuthStore();
    const authentication = useAuthentication(config);

    const handleAuthResponse = async (response: AuthenticationResponse, isAdmin: boolean) => {
        switch (response.status) {
            case "fail":
                toast.error(response.errors, toastOptions);
                break;
            case "success":
                if ("access_token" in response.data) {
                    if (isAdmin) {
                        authStore.setAccessTokenAdmin(response.data.access_token);
                    } else {
                        authStore.setAccessTokenUser(response.data.access_token);
                    }
                }
                navigateTo(externalLinks);
                break;
            default:
                toast.info("Unexpected response from server", toastOptions);
        }
    };

    const register = async <T extends UserRegistrationData | AdminRegistrationData>(
        registerFunction: (payload: T) => Promise<AuthenticationResponse>,
        payload: T,
        isAdmin: boolean
    ) => {
        try {
            const response = await registerFunction(payload);
            await handleAuthResponse(response, isAdmin);
        } catch (error) {
            toast.error("An error occurred during registration. Please try again later.", toastOptions);
            throw error;
        }
    };

    const login = async <T extends UserLoginData | AdminLoginData>(
        loginFunction: (payload: T) => Promise<AuthenticationResponse>,
        payload: T,
        isAdmin: boolean
    ) => {
        try {
            const response = await loginFunction(payload);
            await handleAuthResponse(response, isAdmin);
        } catch (error) {
            toast.error("An error occurred during login. Please try again later.", toastOptions);
            throw error;
        }
    };

    return {
        userRegister: (payload: UserRegistrationData) => register(authentication.userRegister, payload, false),
        adminRegister: (payload: AdminRegistrationData) => register(authentication.adminRegister, payload, true),
        userLogin: (payload: UserLoginData) => login(authentication.userLogin, payload, false),
        adminLogin: (payload: AdminLoginData) => login(authentication.adminLogin, payload, true)
    };
};

export default AuthenticationService;
