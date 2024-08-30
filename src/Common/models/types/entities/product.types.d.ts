interface IProduct {
    id: string;
    product_name: string;
    description: string;
    price: number;
    duration: string;
    free_trial: boolean;
}

interface ITrial {
    id: string;
    user_id: string;
    free_trial: boolean;
}

export type { ITrial, IProduct };
