import { toast, toastOptions } from "@/composables/utils/toast";
import { useRuntimeConfig } from "#app";
import useVerification from "@/composables/api/Verification";
import type { VerificationResponse } from "@/composables/model";

const VerificationService = () => {
    const Config = useRuntimeConfig();
    const verification = useVerification(Config);

    const handleOtpResponse = (otpResponse: VerificationResponse) => {
        switch (otpResponse.status) {
            case "fail":
                toast.error(otpResponse.errors, toastOptions);
                break;
            case "success":
                toast.success("OTP sent successfully", toastOptions);
                break;
            default:
                toast.info("Unexpected response from server", toastOptions);
        }
    };

    const sendOtp = async (
        sendOtpFunction: (email: string) => Promise<VerificationResponse>,
        email: string
    ) => {
        try {
            const otpResponse = await sendOtpFunction(email);
            handleOtpResponse(otpResponse);
        } catch (error) {
            toast.error("An error occurred while sending OTP. Please try again later.", toastOptions);
            throw error;
        }
    };

    return {
        validateSendOtpUserRegister: (email: string) => sendOtp(verification.sendOtpUserRegister, email),
        validateSendOtpAdminRegister: (email: string) => sendOtp(verification.sendOtpAdminRegister, email),
        validateSendOtpUserReset: (email: string) => sendOtp(verification.sendOtpUserReset, email),
        validateSendOtpAdminReset: (email: string) => sendOtp(verification.sendOtpAdminReset, email)
    };
};

export default VerificationService;
