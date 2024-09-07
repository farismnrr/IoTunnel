import type {
	IOrder,
	IOrderData,
	IOrderWithPaymentUrl,
	ISubscription
} from "../../../Common/models/types";
import OrderRepository from "../../../Infrastructure/repositories/server/order.repo";
import AuthRepository from "../../../Infrastructure/repositories/server/auth.repo";
import UserRepository from "../../../Infrastructure/repositories/server/user.repo";
import ProductRepository from "../../../Infrastructure/repositories/server/product.repo";
import MidtransRepository from "../../../Infrastructure/repositories/external/midtrans.repo";
import MosquittoRepository from "../../../Infrastructure/repositories/external/mosquitto.repo";
import SubscriptionRepository from "../../../Infrastructure/repositories/server/subscription.repo";
import { nanoid } from "nanoid";
import { NotFoundError, AuthorizationError, ConnectionError } from "../../../Common/errors";

class OrderService {
	private readonly _orderRepository: OrderRepository;
	private readonly _authRepository: AuthRepository;
	private readonly _userRepository: UserRepository;
	private readonly _productRepository: ProductRepository;
	private readonly _midtransRepository: MidtransRepository;
	private readonly _mosquittoRepository: MosquittoRepository;
	private readonly _subscriptionRepository: SubscriptionRepository;
	constructor(
		orderRepository: OrderRepository,
		authRepository: AuthRepository,
		userRepository: UserRepository,
		productRepository: ProductRepository,
		midtransRepository: MidtransRepository,
		mosquittoRepository: MosquittoRepository,
		subscriptionRepository: SubscriptionRepository
	) {
		this._orderRepository = orderRepository;
		this._authRepository = authRepository;
		this._userRepository = userRepository;
		this._productRepository = productRepository;
		this._midtransRepository = midtransRepository;
		this._mosquittoRepository = mosquittoRepository;
		this._subscriptionRepository = subscriptionRepository;
	}

	async createOrder(userId: string, productId: string): Promise<IOrder> {
		const id = `order-${nanoid(16)}`;
		const status = "pending";
		const connection = await this._mosquittoRepository.getMosquittoConnection();
		if (connection !== 200) {
			throw new ConnectionError("Failed to get Mosquitto Connection");
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
			throw new AuthorizationError(
				"User already has a subscription, please cancel the existing subscription before subscribing to a new product"
			);
		}

		const transactionDetails = {
			order_id: id,
			gross_amount: product.price
		};

		const customerDetails = {
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			phone: user.phone_number
		};

		const itemDetails = {
			id: product.id,
			price: product.price,
			quantity: 1,
			name: product.product_name,
		};

		const payment = await this._midtransRepository.createTransaction(
			transactionDetails,
			customerDetails,
			[itemDetails]
		);

		const orderId = await this._orderRepository.createOrder(userId, productId, {
			id,
			status,
			token: payment.token,
			payment_url: payment.redirect_url
		});

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
		orderId: string,
		api_key: string
	): Promise<IOrderData | IOrderWithPaymentUrl> {
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

		const product = await this._productRepository.getProductById(order.product_id);
		if (!product) {
			throw new NotFoundError("Product not found");
		}

		const paymentStatus = await this._midtransRepository.getTransactionStatus(orderId);
		if (
			paymentStatus.transaction_status !== "settlement" &&
			paymentStatus.transaction_status !== "capture"
		) {
			return {
				token: order.token,
				redirect_url: order.payment_url,
				transaction_status: order.status
			};
		}

		if (order.status !== "paid") {
			await this._orderRepository.editOrderStatus(orderId, "paid");
		}

		const subscription = await this._subscriptionRepository.getSubscriptionByUserId(userid);
		if (!subscription) {
			await this.createOrderWithSubscription(userid, product.id);
			await this._mosquittoRepository.getMosquittoUrl(api_key);
		}

		return {
			id: order.id,
			payment_type: paymentStatus.payment_type,
			transaction_status: order.status,
			product: product,
			subscription: subscription
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
				trialEndDate = new Date(createdAt.getTime() + 1 * 30 * 24 * 60 * 60 * 1000); // Set for 1 Months of Subscription
				break;
			case "3 months":
				trialEndDate = new Date(createdAt.getTime() + 3 * 30 * 24 * 60 * 60 * 1000); // Set for 3 Months of Subscription
				break;
			case "6 months":
				trialEndDate = new Date(createdAt.getTime() + 6 * 30 * 24 * 60 * 60 * 1000); // Set for 6 Months of Subscription
				break;
			default:
				throw new Error(`Unsupported subscription duration: ${subscriptionDuration}`);
		}

		await this._subscriptionRepository.addSubscription(userId, {
			id: `subscription-${product.id}-${Date.now()}`,
			product_id: product.id,
			api_key: `key-${nanoid(16)}-${product.id}-${nanoid(5)}-${Date.now()}`,
			subscription_start_date: createdAt,
			subscription_end_date: trialEndDate
		});
	}

	async getSubscriptions(userId: string): Promise<ISubscription> {
		const subscriptions = await this._subscriptionRepository.getSubscriptionByUserId(userId);
		return subscriptions;
	}
}

export default OrderService;
