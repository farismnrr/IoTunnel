import type { Server } from "@hapi/hapi";
import routes from "./routes";
import OrderHandler from "./handler";
import OrderService from "../../../App/services/order.service";
import AuthRepository from "../../../Infrastructure/repositories/server/auth.repo";
import UserRepository from "../../../Infrastructure/repositories/server/user.repo";
import OrderRepository from "../../../Infrastructure/repositories/server/order.repo";
import ProductRepository from "../../../Infrastructure/repositories/server/product.repo";
import MidtransRepository from "../../../Infrastructure/repositories/external/midtrans.repo";
import MosquittoRepository from "../../../Infrastructure/repositories/external/mosquitto.repo";
import SubscriptionRepository from "../../../Infrastructure/repositories/server/subscription.repo";

const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const midtransRepository = new MidtransRepository();
const mosquittoRepository = new MosquittoRepository();
const subscriptionRepository = new SubscriptionRepository();

const orderService = new OrderService(
	orderRepository,
	authRepository,
	userRepository,
	productRepository,
	midtransRepository,
	mosquittoRepository,
	subscriptionRepository
);
const orderHandler = new OrderHandler(orderService);

export default {
	name: "orders",
	version: "1.1.0",
	description: "Implement Payment Gateway",
	register: (server: Server) => {
		server.route(routes(orderHandler));
	}
};
