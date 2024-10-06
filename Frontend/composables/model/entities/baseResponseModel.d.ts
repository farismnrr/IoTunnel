interface BaseResponse {
    status: "success" | "fail";
    errors: string;
    message: string;
}

export type { BaseResponse };
