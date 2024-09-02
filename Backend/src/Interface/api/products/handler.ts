import type { Request, ResponseToolkit } from "@hapi/hapi";
import type { IProduct, IAuth } from "../../../Common/models/types";
import autoBind from "auto-bind";
import ProductService from "../../../App/services/product.service";
import ProductValidator from "../../../App/validators/products";

class ProductHandler {
	private readonly _productService: ProductService;
	private readonly _validator: typeof ProductValidator;

	constructor(productService: ProductService, validator: typeof ProductValidator) {
		this._productService = productService;
		this._validator = validator;
		autoBind(this);
	}

	// Start Product Handler
	async getProductsHandler(request: Request, h: ResponseToolkit) {
		const products = await this._productService.getProducts();
		return h
			.response({
				status: "success",
				message: "Products fetched successfully",
				data: {
					products
				}
			})
			.code(200);
	}

	async getProductByIdHandler(request: Request, h: ResponseToolkit) {
		const { id } = request.params;
		const product = await this._productService.getProductById(id);
		return h
			.response({
				status: "success",
				message: "Product fetched successfully",
				data: {
					product
				}
			})
			.code(200);
	}
	// End Product Handler

	// Start Admin Auth Handler
	async postProductHandler(request: Request, h: ResponseToolkit) {
		const admin = request.auth.credentials as unknown as IAuth;
		const payload = request.payload as IProduct;
		this._validator.validateAddProductPayload(payload);
		const product = await this._productService.addProduct(admin.id, payload);
		return h
			.response({
				status: "success",
				message: "Product added successfully",
				data: {
					product_id: product
				}
			})
			.code(201);
	}

	async putProductByIdHandler(request: Request, h: ResponseToolkit) {
		const admin = request.auth.credentials as unknown as IAuth;
		const payload = request.payload as IProduct;
		const { id } = request.params;
		this._validator.validateEditProductPayload(payload);
		await this._productService.editProduct(admin.id, id, payload);
		return h
			.response({
				status: "success",
				message: "Product updated successfully"
			})
			.code(200);
	}

	async deleteProductByIdHandler(request: Request, h: ResponseToolkit) {
		const admin = request.auth.credentials as unknown as IAuth;
		const { id } = request.params;
		await this._productService.deleteProduct(admin.id, id);
		return h
			.response({
				status: "success",
				message: "Product deleted successfully"
			})
			.code(200);
	}
	// End Admin Auth Handler

	// Start Trial Handler
	async getTrialByUserIdHandler(request: Request, h: ResponseToolkit) {
		const user = request.auth.credentials as unknown as IAuth;
		const trial = await this._productService.getTrialByUserId(user.id);
		return h
			.response({
				status: "success",
				message: "Trial fetched successfully",
				data: {
					trial: trial
				}
			})
			.code(200);
	}

	async editTrialByUserIdHandler(request: Request, h: ResponseToolkit) {
		const user = request.auth.credentials as unknown as IAuth;
		await this._productService.editTrialByUserId(user.id);
		return h
			.response({
				status: "success",
				message: "Trial updated successfully"
			})
			.code(200);
	}
	// End Trial Handler
}

export default ProductHandler;
