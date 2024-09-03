import type { IProduct, ITrialWithSubscription } from "../../Common/models/types";
import ProductRepository from "../../Infrastructure/repositories/server/product.repo";
import MosquittoRepository from "../../Infrastructure/repositories/external/mosquitto.repo";
import SubscriptionRepository from "../../Infrastructure/repositories/server/subscription.repo";
import UserRepository from "../../Infrastructure/repositories/server/user.repo";
import AuthRepository from "../../Infrastructure/repositories/server/auth.repo";
import { nanoid } from "nanoid";
import { NotFoundError, AuthorizationError } from "../../Common/errors";

class ProductService {
	private readonly _productRepository: ProductRepository;
	private readonly _mosquittoRepository: MosquittoRepository;
	private readonly _subscriptionRepository: SubscriptionRepository;
	private readonly _userRepository: UserRepository;
	private readonly _authRepository: AuthRepository;
	constructor(
		productRepository: ProductRepository,
		mosquittoRepository: MosquittoRepository,
		subscriptionRepository: SubscriptionRepository,
		userRepository: UserRepository,
		authRepository: AuthRepository
	) {
		this._productRepository = productRepository;
		this._mosquittoRepository = mosquittoRepository;
		this._subscriptionRepository = subscriptionRepository;
		this._userRepository = userRepository;
		this._authRepository = authRepository;
	}

	// Start Product Service
	async addProduct(adminId: string, payload: IProduct): Promise<string> {
		const id = `product-${nanoid(12)}`;
		const adminRole = await this._authRepository.getAdminRole(adminId);
		if (adminRole !== "admin") {
			throw new AuthorizationError("You are not authorized to add this product");
		}

		const product = await this._productRepository.addProduct({
			...payload,
			id
		});
		return product;
	}

	async getProducts(): Promise<IProduct[]> {
		const products = await this._productRepository.getProducts();
		return products;
	}

	async getProductById(productId: string): Promise<IProduct | null> {
		const product = await this._productRepository.getProductById(productId);
		if (!product) {
			throw new NotFoundError("Product not found");
		}
		return product;
	}

	async editProduct(adminId: string, productId: string, payload: IProduct): Promise<void> {
		const product = await this._productRepository.getProductById(productId);
		if (!product) {
			throw new NotFoundError("Product not found");
		}
		const adminRole = await this._authRepository.getAdminRole(adminId);
		if (adminRole !== "admin") {
			throw new AuthorizationError("You are not authorized to edit this product");
		}
		await this._productRepository.updateProduct(productId, payload);
	}

	async deleteProduct(adminId: string, productId: string): Promise<void> {
		const product = await this._productRepository.getProductById(productId);
		if (!product) {
			throw new NotFoundError("Product not found");
		}
		const adminRole = await this._authRepository.getAdminRole(adminId);
		if (adminRole !== "admin") {
			throw new AuthorizationError("You are not authorized to delete this product");
		}
		await this._productRepository.deleteProduct(productId);
	}
	// End Product Service

	// Start Trial Service
	async addTrialByUserEmail(email: string): Promise<boolean> {
		const id = `trial-${nanoid(16)}`;
		const trial = await this._productRepository.getTrialByUserEmail(email);
		if (trial) {
			return false;
		}
		await this._productRepository.addTrialByUserEmail(id, email, true);
		return true;
	}

	async getTrialByUserId(userId: string): Promise<ITrialWithSubscription | null> {
		const user = await this._userRepository.getUserById(userId);
		if (!user) {
			throw new NotFoundError("User not found");
		}

		const userRole = await this._authRepository.getUserRole(userId);
		if (userRole !== "user") {
			throw new AuthorizationError("You are not authorized to get this trial");
		}

		const trial = await this._productRepository.getTrialByUserEmail(user.email);
		if (!trial) {
			throw new NotFoundError("Trial not found");
		}

		const subscription = await this._subscriptionRepository.getSubscriptionByUserId(userId);
		return {
			...trial,
			subscription
		};
	}

	async editTrialByUserId(userId: string, api_key: string): Promise<void> {
		const user = await this._userRepository.getUserById(userId);
		if (!user) {
			throw new NotFoundError("User not found");
		}
		const userRole = await this._authRepository.getUserRole(userId);
		if (userRole !== "user") {
			throw new AuthorizationError("You are not authorized to edit this trial");
		}

		const trial = await this._productRepository.getTrialByUserEmail(user.email);
		if (!trial) {
			throw new NotFoundError("Trial not found");
		}

		if (trial.free_trial !== true) {
			throw new AuthorizationError("Trial already used");
		}

		const subscription = await this._subscriptionRepository.getSubscriptionByUserId(userId);
		if (subscription) {
			throw new AuthorizationError("Subscription already exists");
		}

		await this._productRepository.updateTrialByUserEmail(user.email, {
			...trial,
			free_trial: false
		});
		
		const createdAt = new Date();
		const trialEndDate = new Date(createdAt.getTime() + 14 * 24 * 60 * 60 * 1000); // Set for 14 Days of Trials
		// const trialEndDate = new Date(createdAt.getTime() + 1 * 60 * 1000);
		await this._subscriptionRepository.addSubscription(
			userId,
			{
				id: `subscription-${trial.id}-${Date.now()}`,
				trial_id: trial.id,
				api_key: `key-${nanoid(16)}-${trial.id}-${nanoid(5)}-${Date.now()}`,
				subscription_start_date: createdAt,
				subscription_end_date: trialEndDate
			}
		);
		await this._mosquittoRepository.getMosquittoUrl(api_key);
	}
	// End Trial Service
}

export default ProductService;
