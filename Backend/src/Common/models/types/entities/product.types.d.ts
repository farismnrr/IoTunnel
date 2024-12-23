import type { ISubscription } from "./subscription.types";

interface IProduct {
    id: string;
    product_name: string;
    description: string;
    price: number;
    duration: string;
    tags: string | null;
}

interface ITrial {
    id: string;
    email: string;
    free_trial: boolean;
}

interface ITrialWithSubscription extends ITrial {
    subscription: ISubscription;
}

export type { ITrial, IProduct, ITrialWithSubscription };
