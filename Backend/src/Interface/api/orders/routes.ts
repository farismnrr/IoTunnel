import type { ServerRoute } from "@hapi/hapi";
import OrderHandler from "./handler";

const routes: (handler: OrderHandler) => ServerRoute[] = handler => [
	{
		method: "POST",
		path: "/orders/{productId}",
		handler: handler.createOrderHandler,
		options: {
			auth: "user_jwt"
		}
	},
	{
		method: "POST",
		path: "/orders/subscription",
		handler: handler.getSubscriptionsHandler,
		options: {
			auth: "user_jwt"
		}
	},
	{
		method: "GET",
		path: "/orders/{id}",
		handler: handler.getOrderByIdHandler,
		options: {
			auth: "user_jwt"
		}
	},
	{
		method: "GET",
		path: "/subscriptions",
		handler: handler.getSubscriptionsTimeRemainingHandler,
		options: {
			auth: "user_jwt"
		}
	}
];

export default routes;
