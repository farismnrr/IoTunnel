import type { Server } from "@hapi/hapi";
import routes from "./routes";
import OrderHandler from "./handler";
import OrderService from "../../../App/services/order.service";
import AuthRepository from "../../../Infrastructure/repositories/server/auth.repo";
import UserRepository from "../../../Infrastructure/repositories/server/user.repo";
import OrderRepository from "../../../Infrastructure/repositories/server/order.repo";
import ProductRepository from "../../../Infrastructure/repositories/server/product.repo";
import MidtransRepository from "../../../Infrastructure/repositories/external/midtrans.repo";

const userRepository = new UserRepository();
const productRepository = new ProductRepository();
const orderRepository = new OrderRepository();
const midtransRepository = new MidtransRepository();
const authRepository = new AuthRepository();
const orderService = new OrderService(
	orderRepository,
	authRepository,
	userRepository,
	productRepository,
	midtransRepository
);
const orderHandler = new OrderHandler(orderService);

export default {
	name: "orders",
	version: "1.0.0",
	register: (server: Server) => {
		server.route(routes(orderHandler));
	}
};
