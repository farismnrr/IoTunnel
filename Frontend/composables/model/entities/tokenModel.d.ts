import { BaseResponse } from "./baseResponseModel";

interface tokenResponse {
    access_token: string;
}

interface TokenResponse extends BaseResponse {
    data: tokenResponse;
}

export type { TokenResponse };
