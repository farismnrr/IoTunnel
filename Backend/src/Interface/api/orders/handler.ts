import type { Request, ResponseToolkit } from "@hapi/hapi";
import type { IAuth } from "../../../Common/models/types";
import autoBind from "auto-bind";
import OrderService from "../../../App/services/order.service";

class OrderHandler {
	private readonly _orderService: OrderService;

	constructor(orderService: OrderService) {
		this._orderService = orderService;
		autoBind(this);
	}

	async createOrderHandler(request: Request, h: ResponseToolkit) {
		const user = request.auth.credentials as unknown as IAuth;
		const { productId } = request.params;
		const order = await this._orderService.createOrder(user.id, productId);
		return h
			.response({
				status: "success",
				message: "Order created successfully",
				data: order
			})
			.code(201);
	}

	async getOrderByIdHandler(request: Request, h: ResponseToolkit) {
		const user = request.auth.credentials as unknown as IAuth;
		const api_key = request.headers.authorization;
		const { id } = request.params;
		const order = await this._orderService.getOrderById(user.id, id, api_key);
		return h.response({
			status: "success",
			message: "Order fetched successfully",
			data: order
		});
	}

	async getSubscriptionsHandler(request: Request, h: ResponseToolkit) {
		console.log(request.headers.authorization);
		const user = request.auth.credentials as unknown as IAuth;
		const subscription = await this._orderService.getSubscriptions(user.id);
		return h.response({
			status: "success",
			message: "Subscription fetched successfully",
			data: subscription
		});
	}
}

export default OrderHandler;
