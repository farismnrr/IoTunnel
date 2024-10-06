import type { Server } from "@hapi/hapi";
import routes from "./routes";
import OrderHandler from "./handler";
import config from "../../../Infrastructure/settings/config";
import OrderService from "../../../App/services/server/order.service";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";
import OrderRepository from "../../../Infrastructure/repositories/server/postgres/order.repo";
import ProductRepository from "../../../Infrastructure/repositories/server/postgres/product.repo";
import MidtransRepository from "../../../Infrastructure/repositories/external/midtrans.repo";
import MosquittoRepository from "../../../Infrastructure/repositories/server/mqtt/mosquitto.repo";
import RedisRepository from "../../../Infrastructure/repositories/server/cache/redis.repo";
import SubscriptionRepository from "../../../Infrastructure/repositories/server/postgres/subscription.repo";
import CursRepository from "../../../Infrastructure/repositories/external/curs.repo";
import ResponseManager from "../../../Common/manager/manager.response";

const cursRepository = new CursRepository();
const userRepository = new UserRepository(config.photo.default as string);
const authRepository = new AuthRepository(config.timeOut.otp as number);
const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const midtransRepository = new MidtransRepository();
const mosquittoRepository = new MosquittoRepository();
const subscriptionRepository = new SubscriptionRepository();
const redisRepository = new RedisRepository();

const orderService = new OrderService(
    orderRepository,
    authRepository,
    userRepository,
    productRepository,
    midtransRepository,
    mosquittoRepository,
    subscriptionRepository,
    redisRepository,
    cursRepository,
    config.timeOut.oneMonth as number,
    config.timeOut.threeMonth as number,
    config.timeOut.sixMonth as number
);
const orderHandler = new OrderHandler(orderService, ResponseManager);

export default {
    name: "orders",
    version: "1.1.0",
    description: "Implement Payment Gateway",
    register: (server: Server) => {
        server.route(routes(orderHandler));
    }
};
