import type { BaseResponse } from "../index";

interface SubscriptionData {
    id: string;
    expired: string;
}

interface GetSubscriptionResponse extends BaseResponse {
    data: SubscriptionData;
}

export type { GetSubscriptionResponse, SubscriptionData };
