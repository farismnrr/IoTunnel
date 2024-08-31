import type { Server } from "@hapi/hapi";
import routes from "./routes";
import ProductHandler from "./handler";
import ProductService from "../../../App/services/product.service";
import ProductRepository from "../../../Infrastructure/repositories/product.repo";
import UserRepository from "../../../Infrastructure/repositories/user.repo";
import AuthRepository from "../../../Infrastructure/repositories/auth.repo";
import ProductValidator from "../../../App/validators/products";

const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const productRepository = new ProductRepository();

const productService = new ProductService(productRepository, userRepository, authRepository);
const productHandler = new ProductHandler(productService, ProductValidator);

export default {
	name: "products",
    version: "1.0.0",
	register: (server: Server) => {
		server.route(routes(productHandler));
	}
};