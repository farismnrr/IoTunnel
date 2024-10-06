import { BaseResponse } from "./baseResponseModel";

interface otpResponse {
    otp_code: number;
}

interface VerificationResponse extends BaseResponse {
    data: otpResponse;
}

export type { VerificationResponse };
