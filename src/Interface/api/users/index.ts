import type { Server } from "@hapi/hapi";
import routes from "./routes";
import UserHandler from "./handler";
import UserService from "../../../App/services/user.service";
import ProductService from "../../../App/services/product.service";
import UserValidator from "../../../App/validators/users";
import MailRepository from "../../../Infrastructure/repositories/mail.repo";
import AuthRepository from "../../../Infrastructure/repositories/auth.repo";
import UserRepository from "../../../Infrastructure/repositories/user.repo";
import ProductRepository from "../../../Infrastructure/repositories/product.repo";
import TokenManager from "../../../Common/tokens/manager.token";

const userRepository = new UserRepository();
const productRepository = new ProductRepository();
const mailRepository = new MailRepository();
const authRepository = new AuthRepository();

const userService = new UserService(userRepository, mailRepository, authRepository);
const productService = new ProductService(productRepository, authRepository);
const userHandler = new UserHandler(userService, productService, UserValidator, TokenManager);

export default {
	name: "users",
	version: "1.0.0",
	register: async (server: Server) => {
		server.route(routes(userHandler));
	}
};