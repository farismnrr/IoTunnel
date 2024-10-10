import type { IOrder, IOrderData, IOrderWithPaymentUrl } from "../../../Common/models/types";
import OrderRepository from "../../../Infrastructure/repositories/server/postgres/order.repo";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";
import ProductRepository from "../../../Infrastructure/repositories/server/postgres/product.repo";
import MidtransRepository from "../../../Infrastructure/repositories/external/midtrans.repo";
import MosquittoRepository from "../../../Infrastructure/repositories/server/mqtt/mosquitto.repo";
import RedisRepository from "../../../Infrastructure/repositories/server/cache/redis.repo";
import SubscriptionRepository from "../../../Infrastructure/repositories/server/postgres/subscription.repo";
import CursRepository from "../../../Infrastructure/repositories/external/curs.repo";
import { nanoid } from "nanoid";
import { NotFoundError, AuthorizationError, ConflictError } from "../../../Common/errors";

class OrderService {
    private readonly _orderRepository: OrderRepository;
    private readonly _authRepository: AuthRepository;
    private readonly _userRepository: UserRepository;
    private readonly _productRepository: ProductRepository;
    private readonly _midtransRepository: MidtransRepository;
    private readonly _mosquittoRepository: MosquittoRepository;
    private readonly _subscriptionRepository: SubscriptionRepository;
    private readonly _redisRepository: RedisRepository;
    private readonly _cursRepository: CursRepository;
    private readonly _oneMonth: number;
    private readonly _threeMonth: number;
    private readonly _sixMonth: number;

    constructor(
        orderRepository: OrderRepository,
        authRepository: AuthRepository,
        userRepository: UserRepository,
        productRepository: ProductRepository,
        midtransRepository: MidtransRepository,
        mosquittoRepository: MosquittoRepository,
        subscriptionRepository: SubscriptionRepository,
        redisRepository: RedisRepository,
        cursRepository: CursRepository,
        oneMonth: number,
        threeMonth: number,
        sixMonth: number
    ) {
        this._orderRepository = orderRepository;
        this._authRepository = authRepository;
        this._userRepository = userRepository;
        this._productRepository = productRepository;
        this._midtransRepository = midtransRepository;
        this._mosquittoRepository = mosquittoRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._redisRepository = redisRepository;
        this._cursRepository = cursRepository;
        this._oneMonth = oneMonth;
        this._threeMonth = threeMonth;
        this._sixMonth = sixMonth;
    }

    async createOrder(userId: string, productId: string): Promise<IOrder> {
        const id = `order-${nanoid(16)}`;
        const status = "pending";
        const order = await this._orderRepository.getOrderByUserId(userId);
        if (order) {
            throw new ConflictError("User already has an order");
        }
        const user = await this._userRepository.getUserById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const userRole = await this._authRepository.getUserRole(userId);
        if (userRole !== "user") {
            throw new AuthorizationError("User does not have permission to create order");
        }
        const product = await this._productRepository.getProductById(productId);
        if (!product) {
            throw new NotFoundError("Product not found");
        }
        const subscription = await this._subscriptionRepository.getSubscriptionByUserId(userId);
        if (subscription) {
            throw new ConflictError(
                "User already has a subscription, please cancel the existing subscription before subscribing to a new product"
            );
        }
        const price = await this._cursRepository.konversiUSDKeIDR(product.price);
        const transactionDetails = {
            order_id: id,
            gross_amount: price
        };
        const customerDetails = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone_number
        };
        const itemDetails = {
            id: product.id,
            price: price,
            quantity: 1,
            name: product.product_name
        };
        const payment = await this._midtransRepository.createTransaction(
            transactionDetails,
            customerDetails,
            [itemDetails]
        );
        if (!payment) {
            throw new ConflictError("Failed to create payment");
        }
        const orderId = await this._orderRepository.createOrder(userId, productId, {
            id,
            status,
            token: payment.token,
            payment_url: payment.redirect_url
        });
        await this._redisRepository.delete(`order:${orderId}`);
        return {
            id: orderId,
            user_id: userId,
            product_id: productId,
            status,
            token: payment.token,
            payment_url: payment.redirect_url
        };
    }

    async getOrderById(
        userid: string,
        orderId: string
    ): Promise<{ order: IOrderData; source: string } | IOrderWithPaymentUrl> {
        const order = await this._orderRepository.getOrderById(orderId);
        if (!order) {
            throw new NotFoundError("Order not found");
        }
        const userRole = await this._authRepository.getUserRole(userid);
        if (userRole !== "user") {
            throw new AuthorizationError("User does not have permission to get order");
        }
        if (order.user_id !== userid) {
            throw new AuthorizationError("User does not have permission to get order");
        }
        const orderCache = await this._redisRepository.get(`order:${orderId}`);
        if (orderCache) {
            return {
                order: JSON.parse(orderCache),
                source: "cache"
            };
        }
        const product = await this._productRepository.getProductById(order.product_id);
        if (!product) {
            throw new NotFoundError("Product not found");
        }
        const paymentStatus = await this._midtransRepository.getTransactionStatus(orderId);
        if (
            paymentStatus.transaction_status !== "settlement" &&
            paymentStatus.transaction_status !== "capture"
        ) {
            await this._redisRepository.delete(`order:${orderId}`);
            return {
                token: order.token,
                redirect_url: order.payment_url,
                transaction_status: order.status
            };
        }
        if (order.status !== "paid") {
            await this._orderRepository.editOrderStatus(orderId, "paid");
            await this._redisRepository.delete(`order:${orderId}`);
        }
        const subscription = await this._subscriptionRepository.getSubscriptionByUserId(userid);
        if (!subscription) {
            await this.createOrderWithSubscription(userid, product.id);
            await this._redisRepository.delete(`order:${orderId}`);
        }
        const orderData = {
            id: order.id,
            payment_type: paymentStatus.payment_type,
            transaction_status: order.status,
            product: product,
            subscription: subscription
        };
        await this._redisRepository.set(`order:${orderId}`, orderData);
        return {
            order: orderData,
            source: "database"
        };
    }

    async createOrderWithSubscription(userId: string, productId: string): Promise<void> {
        const user = await this._userRepository.getUserById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const product = await this._productRepository.getProductById(productId);
        if (!product) {
            throw new NotFoundError("Product not found");
        }
        const subscriptionDuration = product.duration;
        const createdAt = new Date();
        let trialEndDate;
        switch (subscriptionDuration) {
            case "1 month":
                trialEndDate = new Date(createdAt.getTime() + this._oneMonth); // Set for 1 Months of Subscription
                break;
            case "3 months":
                trialEndDate = new Date(createdAt.getTime() + this._threeMonth); // Set for 3 Months of Subscription
                break;
            case "6 months":
                trialEndDate = new Date(createdAt.getTime() + this._sixMonth); // Set for 6 Months of Subscription
                break;
            default:
                throw new Error(`Unsupported subscription duration: ${subscriptionDuration}`);
        }
        const apiKey = `key-${nanoid(16)}-${product.id}-${nanoid(5)}-${Date.now()}`;
        await this._subscriptionRepository.addSubscription(userId, {
            id: `subscription-${product.id}-${Date.now()}`,
            product_id: product.id,
            api_key: apiKey,
            subscription_start_date: createdAt,
            subscription_end_date: trialEndDate
        });
        await this._mosquittoRepository.updateMosquittoPassword(userId, apiKey);
    }

    async getSubscriptionsTimeRemaining(userId: string): Promise<string> {
        const date = new Date();
        const subscriptionEndDate = await this._subscriptionRepository.getSubscriptionEndDate(
            userId
        );
        if (!subscriptionEndDate) {
            throw new NotFoundError("Subscription not found");
        }
        const endDate = new Date(subscriptionEndDate);
        const timeRemaining = endDate.getTime() - date.getTime();

        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

        return `Remaining subscription time: ${days} days, ${hours} hours, ${minutes} minutes`;
    }
}

export default OrderService;
