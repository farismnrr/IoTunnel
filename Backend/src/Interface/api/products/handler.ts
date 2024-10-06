import type { Request, ResponseToolkit } from "@hapi/hapi";
import type { IProduct, IAuth } from "../../../Common/models/types";
import autoBind from "auto-bind";
import ProductService from "../../../App/services/server/product.service";
import ProductValidator from "../../../App/validators/products";
import ResponseManager from "../../../Common/manager/manager.response";

class ProductHandler {
    private readonly _productService: ProductService;
    private readonly _validator: typeof ProductValidator;
    private readonly _responseManager: typeof ResponseManager;

    constructor(
        productService: ProductService,
        validator: typeof ProductValidator,
        responseManager: typeof ResponseManager
    ) {
        this._productService = productService;
        this._validator = validator;
        this._responseManager = responseManager;
        autoBind(this);
    }

    // Start Product Handler
    async getProductsHandler(request: Request, h: ResponseToolkit) {
        const serverKey = request.headers.authorization;
        const products = await this._productService.getProducts(serverKey);
        const response = {
            status: "success",
            message: "Products fetched successfully",
            data: {
                products
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async getProductByIdHandler(request: Request, h: ResponseToolkit) {
        const { id } = request.params;
        const serverKey = request.headers.authorization;
        const product = await this._productService.getProductById(serverKey, id);
        const response = {
            status: "success",
            message: "Product fetched successfully",
            data: {
                product
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }
    // End Product Handler

    // Start Admin Auth Handler
    async postProductHandler(request: Request, h: ResponseToolkit) {
        const admin = request.auth.credentials as unknown as IAuth;
        const payload = request.payload as IProduct;
        this._validator.validateAddProductPayload(payload);
        const product = await this._productService.addProduct(admin.id, payload);
        const response = {
            status: "success",
            message: "Product added successfully",
            data: {
                product_id: product
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(201);
    }

    async putProductByIdHandler(request: Request, h: ResponseToolkit) {
        const admin = request.auth.credentials as unknown as IAuth;
        const payload = request.payload as IProduct;
        const { id } = request.params;
        this._validator.validateEditProductPayload(payload);
        await this._productService.editProduct(admin.id, id, payload);
        const response = {
            status: "success",
            message: "Product updated successfully"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async deleteProductByIdHandler(request: Request, h: ResponseToolkit) {
        const admin = request.auth.credentials as unknown as IAuth;
        const { id } = request.params;
        await this._productService.deleteProduct(admin.id, id);
        const response = {
            status: "success",
            message: "Product deleted successfully"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }
    // End Admin Auth Handler

    // Start Trial Handler
    async getTrialByUserIdHandler(request: Request, h: ResponseToolkit) {
        const user = request.auth.credentials as unknown as IAuth;
        const trial = await this._productService.getTrialByUserId(user.id);
        const response = {
            status: "success",
            message: "Trial fetched successfully",
            data: trial
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async editTrialByUserIdHandler(request: Request, h: ResponseToolkit) {
        const user = request.auth.credentials as unknown as IAuth;
        await this._productService.editTrialByUserId(user.id);
        const response = {
            status: "success",
            message: "Trial updated successfully"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }
    // End Trial Handler
}

export default ProductHandler;
