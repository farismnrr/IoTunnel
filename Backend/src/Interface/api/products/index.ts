import type { Server } from "@hapi/hapi";
import routes from "./routes";
import ProductHandler from "./handler";
import ProductService from "../../../App/services/server/product.service";
import ProductRepository from "../../../Infrastructure/repositories/server/postgres/product.repo";
import MosquittoRepository from "../../../Infrastructure/repositories/external/mosquitto.repo";
import SubscriptionRepository from "../../../Infrastructure/repositories/server/postgres/subscription.repo";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import ProductValidator from "../../../App/validators/products";
import config from "../../../Infrastructure/settings/config";

const authRepository = new AuthRepository();
const userRepository = new UserRepository(config.photo.default as string);
const productRepository = new ProductRepository();
const mosquittoRepository = new MosquittoRepository();
const subscriptionRepository = new SubscriptionRepository();

const productService = new ProductService(
	productRepository,
	mosquittoRepository,
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
