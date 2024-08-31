import type { IOrder, IPaymentStatus, IOrderWithPaymentUrl } from "../../Common/models/types";
import OrderRepository from "../../Infrastructure/repositories/server/order.repo";
import AuthRepository from "../../Infrastructure/repositories/server/auth.repo";
import UserRepository from "../../Infrastructure/repositories/server/user.repo";
import ProductRepository from "../../Infrastructure/repositories/server/product.repo";
import MidtransRepository from "../../Infrastructure/repositories/external/midtrans.repo";
import { nanoid } from "nanoid";
import { NotFoundError, AuthorizationError } from "../../Common/errors";

class OrderService {
	private readonly _orderRepository: OrderRepository;
	private readonly _authRepository: AuthRepository;
	private readonly _userRepository: UserRepository;
	private readonly _productRepository: ProductRepository;
	private readonly _midtransRepository: MidtransRepository;

	constructor(
		orderRepository: OrderRepository,
		authRepository: AuthRepository,
		userRepository: UserRepository,
		productRepository: ProductRepository,
		midtransRepository: MidtransRepository
	) {
		this._orderRepository = orderRepository;
		this._authRepository = authRepository;
		this._userRepository = userRepository;
		this._productRepository = productRepository;
		this._midtransRepository = midtransRepository;
	}

	async createOrder(userId: string, productId: string): Promise<IOrder> {
		const id = `order-${nanoid(16)}`;
		const status = "pending";

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
			name: product.product_name
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
		orderId: string
	): Promise<IOrderWithPaymentUrl | IPaymentStatus> {
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
			const status = await this._orderRepository.editOrderStatus(orderId, "paid");
			return {
				...paymentStatus,
				transaction_status: status
			};
		}

		return {
			...paymentStatus,
			transaction_status: order.status
		};
	}
}

export default OrderService;
