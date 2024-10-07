import { toast, toastOptions } from "@/composables/utils/toast";
import { useRuntimeConfig } from "#app";
import useAuthentication from "@/composables/api/Authentication";
import type {
    AdminRegistrationData,
    UserRegistrationData,
    UserLoginData,
    AdminLoginData,
    AuthenticationResponse
} from "@/composables/model";

const AuthenticationService = (externalLinks: string) => {
    const Config = useRuntimeConfig();
    const authentication = useAuthentication(Config);

    const handleAuthResponse = (response: AuthenticationResponse) => {
        switch (response.status) {
            case "fail":
                toast.error(response.errors, toastOptions);
                break;
            case "success":
                navigateTo(externalLinks);
                break;
            default:
                toast.info("Unexpected response from server", toastOptions);
        }
    };

    const register = async <T extends UserRegistrationData | AdminRegistrationData>(
        registerFunction: (payload: T) => Promise<AuthenticationResponse>,
        payload: T
    ) => {
        try {
            const response = await registerFunction(payload);
            handleAuthResponse(response);
        } catch (error) {
            toast.error("An error occurred during registration. Please try again later.", toastOptions);
            throw error;
        }
    };

    const login = async <T extends UserLoginData | AdminLoginData>(
        loginFunction: (payload: T) => Promise<AuthenticationResponse>,
        payload: T
    ) => {
        try {
            const response = await loginFunction(payload);
            handleAuthResponse(response);
        } catch (error) {
            toast.error("An error occurred during login. Please try again later.", toastOptions);
            throw error;
        }
    };

    return {
        userRegister: (payload: UserRegistrationData) => register(authentication.userRegister, payload),
        adminRegister: (payload: AdminRegistrationData) => register(authentication.adminRegister, payload),
        userLogin: (payload: UserLoginData) => login(authentication.userLogin, payload),
        adminLogin: (payload: AdminLoginData) => login(authentication.adminLogin, payload)
    };
};

export default AuthenticationService;
