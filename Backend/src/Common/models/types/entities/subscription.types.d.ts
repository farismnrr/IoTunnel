interface ISubscription {
    id: string;
    user_id: string;
    product_id: string;
    trial_id: string;
    api_key: string;
    subscription_start_date: Date;
    subscription_end_date: Date;
}

export type { ISubscription };
