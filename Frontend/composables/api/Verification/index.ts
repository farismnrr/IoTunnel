import Verification from "./verification";
import EncryptionManager from "@/composables/utils/encryption";
import type { Config, VerificationResponse } from "@/composables/model";

interface VerificationInterface {
    sendOtpUserRegister: (email: string) => Promise<VerificationResponse>;
    sendOtpAdminRegister: (email: string) => Promise<VerificationResponse>;
    sendOtpUserReset: (email: string) => Promise<VerificationResponse>;
    sendOtpAdminReset: (email: string) => Promise<VerificationResponse>;
}

const useVerification = (config: Config): VerificationInterface => {
    const encryptionManager = new EncryptionManager(config.public.privateKey, config.public.publicKey);
    const verification = new Verification(config.public.apiUrl, config.public.apiSecret, encryptionManager);

    return {
        sendOtpUserRegister: (email: string) => verification.sendOtpUserRegister(email),
        sendOtpAdminRegister: (email: string) => verification.sendOtpAdminRegister(email),
        sendOtpUserReset: (email: string) => verification.sendOtpUserRegister(email),
        sendOtpAdminReset: (email: string) => verification.sendOtpAdminRegister(email)
    };
};

export default useVerification;
