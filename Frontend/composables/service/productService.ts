import { toast, toastOptions } from "@/composables/utils/toast";
import useProduct from "@/composables/api/Products";
import type { Config, ProductResponse, BaseResponse, ProductData } from "@/composables/model";

const ProductService = (config: Config) => {
    const product = useProduct(config);

    const handleProductResponse = async (response: ProductResponse | BaseResponse) => {
        const { status } = response;

        switch (status) {
            case "fail":
                toast.error("errors" in response ? response.errors : "Operation failed", toastOptions);
                break;
            case "success":
                break;
            default:
                toast.info("Unexpected response from server", toastOptions);
        }
    };

    const getProducts = async (getProductsFunction: () => Promise<ProductResponse>): Promise<ProductData> => {
        try {
            const response = await getProductsFunction();
            await handleProductResponse(response);
            return response.data;
        } catch (error) {
            toast.error("An error occurred while fetching products. Please try again later.", toastOptions);
            throw error;
        }
    };

    return {
        getProducts: () => getProducts(product.getProducts)
    };
};

export default ProductService;
