interface BaseResponse {
    status: string;
    message: string;
}

interface ResponseOtp extends BaseResponse {
    errors?: string;
}

export type { ResponseOtp };
