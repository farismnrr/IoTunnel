import type { Server } from "@hapi/hapi";
import routes from "./routes";
import UserHandler from "./handler";
import UserValidator from "../../../App/validators/users";
import config from "../../../Infrastructure/settings/config";
import TokenManager from "../../../Common/tokens/manager.token";
import UserService from "../../../App/services/server/user.service";
import ProductService from "../../../App/services/server/product.service";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import MailRepository from "../../../Infrastructure/repositories/server/postgres/mail.repo";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";
import MosquittoRepository from "../../../Infrastructure/repositories/external/mosquitto.repo";
import ProductRepository from "../../../Infrastructure/repositories/server/postgres/product.repo";
import SubscriptionRepository from "../../../Infrastructure/repositories/server/postgres/subscription.repo";

const mailRepository = new MailRepository();
const authRepository = new AuthRepository();
const productRepository = new ProductRepository();
const mosquittoRepository = new MosquittoRepository();
const subscriptionRepository = new SubscriptionRepository();
const userRepository = new UserRepository(config.photo.default as string);

const userService = new UserService(userRepository, mailRepository, authRepository);
const productService = new ProductService(
	productRepository,
	mosquittoRepository,
	subscriptionRepository,
	userRepository,
	authRepository
);
const userHandler = new UserHandler(userService, productService, UserValidator, TokenManager);

export default {
	name: "users",
	version: "1.1.1",
	description: "Add User Photo",
	register: async (server: Server) => {
		server.route(routes(userHandler));
	}
};
