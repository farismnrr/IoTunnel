import type { Server } from "@hapi/hapi";
import routes from "./routes";
import UserHandler from "./handler";
import UserValidator from "../../../App/validators/users";
import config from "../../../Infrastructure/settings/config";
import TokenManager from "../../../Common/manager/manager.token";
import ResponseManager from "../../../Common/manager/manager.response";
import UserService from "../../../App/services/server/user.service";
import ProductService from "../../../App/services/server/product.service";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import MailRepository from "../../../Infrastructure/repositories/server/mail/mail.repo";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";
import MosquittoRepository from "../../../Infrastructure/repositories/server/mqtt/mosquitto.repo";
import ProductRepository from "../../../Infrastructure/repositories/server/postgres/product.repo";
import RedisRepository from "../../../Infrastructure/repositories/server/cache/redis.repo";
import SubscriptionRepository from "../../../Infrastructure/repositories/server/postgres/subscription.repo";

const mailRepository = new MailRepository();
const authRepository = new AuthRepository(config.timeOut.otp as number);
const productRepository = new ProductRepository();
const mosquittoRepository = new MosquittoRepository();
const subscriptionRepository = new SubscriptionRepository();
const redisRepository = new RedisRepository();
const userRepository = new UserRepository(config.photo.default as string);
const userService = new UserService(
    userRepository,
    mailRepository,
    authRepository,
    redisRepository,
    config.jwt.serverKey as string
);

const productService = new ProductService(
    productRepository,
    mosquittoRepository,
    subscriptionRepository,
    userRepository,
    authRepository,
    redisRepository,
    config.timeOut.trial as number,
    config.jwt.serverKey as string
);

const userHandler = new UserHandler(
    userService,
    productService,
    UserValidator,
    TokenManager,
    ResponseManager
);

export default {
    name: "users",
    version: "1.1.1",
    description: "Add User Photo",
    register: async (server: Server) => {
        server.route(routes(userHandler));
    }
};
