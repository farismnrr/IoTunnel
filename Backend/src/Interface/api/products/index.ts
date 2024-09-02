import type { Server } from "@hapi/hapi";
import routes from "./routes";
import ProductHandler from "./handler";
import ProductService from "../../../App/services/product.service";
import ProductRepository from "../../../Infrastructure/repositories/server/product.repo";
import SubscriptionRepository from "../../../Infrastructure/repositories/server/subscription.repo";
import UserRepository from "../../../Infrastructure/repositories/server/user.repo";
import AuthRepository from "../../../Infrastructure/repositories/server/auth.repo";
import ProductValidator from "../../../App/validators/products";

const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const productRepository = new ProductRepository();
const subscriptionRepository = new SubscriptionRepository();

const productService = new ProductService(
	productRepository,
	subscriptionRepository,
	userRepository,
	authRepository
);
const productHandler = new ProductHandler(productService, ProductValidator);

export default {
	name: "products",
	version: "1.0.0",
	description: "Add Product API",
	register: (server: Server) => {
		server.route(routes(productHandler));
	}
};
