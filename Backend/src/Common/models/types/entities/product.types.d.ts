interface IProduct {
    id: string;
    product_name: string;
    description: string;
    price: number;
    duration: string;
}

interface ITrial {
    id: string;
    email: string;
    free_trial: boolean;
}

export type { ITrial, IProduct };
