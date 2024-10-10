import type { BaseResponse } from "../index";

interface Product {
    id: string;
    product_name: string;
    description: string;
    price: number | string;
    duration: string;
    tags: string;
}

interface ProductResponse extends BaseResponse {
    data: {
        products: Product[];
    };
}

interface ProductData {
    products: Product[];
}

export type { ProductResponse, ProductData, Product };
