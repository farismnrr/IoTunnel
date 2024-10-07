import Authentication from "./authentication";
import EncryptionManager from "@/composables/utils/encryption";
import type {
    Config,
    UserRegistrationData,
    AdminRegistrationData,
    UserLoginData,
    AdminLoginData,
    AuthenticationResponse
} from "@/composables/model";

interface AuthenticationInterface {
    userRegister: (payload: UserRegistrationData) => Promise<AuthenticationResponse>;
    adminRegister: (payload: AdminRegistrationData) => Promise<AuthenticationResponse>;
    userLogin: (payload: UserLoginData) => Promise<AuthenticationResponse>;
    adminLogin: (payload: AdminLoginData) => Promise<AuthenticationResponse>;
}

const useAuthentication = (config: Config): AuthenticationInterface => {
    const encryptionManager = new EncryptionManager(config.public.privateKey, config.public.publicKey);
    const authentication = new Authentication(config.public.apiUrl, config.public.apiSecret, encryptionManager);

    return {
        userRegister: (payload: UserRegistrationData) => authentication.userRegister(payload),
        adminRegister: (payload: AdminRegistrationData) => authentication.adminRegister(payload),
        userLogin: (payload: UserLoginData) => authentication.userLogin(payload),
        adminLogin: (payload: AdminLoginData) => authentication.adminLogin(payload)
    };
};

export default useAuthentication;
