import type { Request, ResponseToolkit } from "@hapi/hapi";
import type { IAuth } from "../../../Common/models/types";
import autoBind from "auto-bind";
import OrderService from "../../../App/services/server/order.service";
import ResponseManager from "../../../Common/manager/manager.response";

class OrderHandler {
    private readonly _orderService: OrderService;
    private readonly _responseManager: typeof ResponseManager;

    constructor(orderService: OrderService, responseManager: typeof ResponseManager) {
        this._orderService = orderService;
        this._responseManager = responseManager;
        autoBind(this);
    }

    async createOrderHandler(request: Request, h: ResponseToolkit) {
        const user = request.auth.credentials as unknown as IAuth;
        const { productId } = request.params;
        const order = await this._orderService.createOrder(user.id, productId);
        const response = {
            status: "success",
            message: "Order created successfully",
            data: order
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(201);
    }

    async getOrderByIdHandler(request: Request, h: ResponseToolkit) {
        const user = request.auth.credentials as unknown as IAuth;
        const { id } = request.params;
        const order = await this._orderService.getOrderById(user.id, id);
        const response = {
            status: "success",
            message: "Order fetched successfully",
            data: order
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async getSubscriptionsTimeRemainingHandler(request: Request, h: ResponseToolkit) {
        const user = request.auth.credentials as unknown as IAuth;
        const timeRemaining = await this._orderService.getSubscriptionsTimeRemaining(user.id);
        const response = {
            status: "success",
            message: "Subscription time remaining fetched successfully",
            data: timeRemaining
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }
}

export default OrderHandler;
