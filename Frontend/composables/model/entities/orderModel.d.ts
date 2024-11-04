import type { BaseResponse } from "@/composables/model";

interface Product {
    id: string;
    product_name: string;
    description: string;
    price: string;
    duration: string;
    tags: string;
}

interface Subscription {
    id: string;
    user_id: string;
    product_id: string | null;
    trial_id: string | null;
    api_key: string;
    subscription_start_date: string;
    subscription_end_date: string;
}

interface CreateOrderData {
    id: string;
    user_id: string;
    product_id: string;
    status: string;
    token: string;
    payment_url: string;
}

interface CreateOrderResult {
    id: string;
    token: string;
}

interface CreateOrderResponse extends BaseResponse {
    data: CreateOrderResult;
}

interface GetPendingOrderData {
    token: string;
    redirect_url: string;
    transaction_status: string;
}

interface GetPaidPendingOrderData {
    order: {
        id: string;
        payment_type: string;
        transaction_status: string;
        product: Product;
    };
    source: string;
}

interface GetPaidOrderData {
    order: {
        id: string;
        payment_type: string;
        transaction_status: string;
        product: Product;
        subscription: Subscription;
    };
    source: string;
}

interface GetOrderResponse extends BaseResponse {
    data: GetPendingOrderData | GetPaidPendingOrderData | GetPaidOrderData;
}

export type { CreateOrderResponse, GetOrderResponse, CreateOrderResult };
