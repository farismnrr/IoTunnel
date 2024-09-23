import type { IProduct, ITrialWithSubscription } from "../../../Common/models/types";
import ProductRepository from "../../../Infrastructure/repositories/server/postgres/product.repo";
import MosquittoRepository from "../../../Infrastructure/repositories/external/mosquitto.repo";
import SubscriptionRepository from "../../../Infrastructure/repositories/server/postgres/subscription.repo";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import RedisRepository from "../../../Infrastructure/repositories/server/cache/redis.repo";
import { nanoid } from "nanoid";
import {
    NotFoundError,
    AuthorizationError,
    ConnectionError,
    InvariantError,
    AuthenticationError
} from "../../../Common/errors";

class ProductService {
    private readonly _productRepository: ProductRepository;
    private readonly _mosquittoRepository: MosquittoRepository;
    private readonly _subscriptionRepository: SubscriptionRepository;
    private readonly _userRepository: UserRepository;
    private readonly _authRepository: AuthRepository;
    private readonly _redisRepository: RedisRepository;
    private readonly _serverKey: string;

    constructor(
        productRepository: ProductRepository,
        mosquittoRepository: MosquittoRepository,
        subscriptionRepository: SubscriptionRepository,
        userRepository: UserRepository,
        authRepository: AuthRepository,
        redisRepository: RedisRepository,
        serverKey: string
    ) {
        this._productRepository = productRepository;
        this._mosquittoRepository = mosquittoRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._userRepository = userRepository;
        this._authRepository = authRepository;
        this._redisRepository = redisRepository;
        this._serverKey = serverKey;
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

    async getProducts(serverKey: string): Promise<IProduct[]> {
        if (!serverKey) {
            throw new AuthenticationError("Unauthorized");
        }
        const apiKey = serverKey.split(" ")[1];
        if (apiKey !== this._serverKey) {
            throw new AuthorizationError("You are not authorized to get products");
        }
        const products = await this._productRepository.getProducts();
        return products;
    }

    async getProductById(serverKey: string, productId: string): Promise<IProduct | null> {
        if (!serverKey) {
            throw new AuthenticationError("Unauthorized");
        }
        const apiKey = serverKey.split(" ")[1];
        if (apiKey !== this._serverKey) {
            throw new AuthorizationError("You are not authorized to get product");
        }
        const product = await this._productRepository.getProductById(productId);
        if (!product) {
            throw new NotFoundError("Product not found");
        }
        return product;
    }

    async editProduct(adminId: string, productId: string, payload: IProduct): Promise<void> {
        if (!payload) {
            throw new InvariantError("Product details are required");
        }
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
        await this._redisRepository.delete(`trial:${email}`);
        return true;
    }

    async getTrialByUserId(
        userId: string
    ): Promise<{ trial: ITrialWithSubscription; source: string }> {
        const user = await this._userRepository.getUserById(userId);
        const trialCache = await this._redisRepository.get(`trial:${user.email}`);
        if (trialCache) {
            return {
                trial: JSON.parse(trialCache),
                source: "cache"
            };
        }
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
        const data = {
            ...trial,
            subscription
        };
        await this._redisRepository.set(`trial:${user.email}`, data);
        return {
            trial: data,
            source: "database"
        };
    }

    async editTrialByUserId(userId: string, api_key: string): Promise<void> {
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
        // const trialEndDate = new Date(createdAt.getTime() + 5 * 60 * 1000);
        await this._subscriptionRepository.addSubscription(userId, {
            id: `subscription-${trial.id}-${Date.now()}`,
            trial_id: trial.id,
            api_key: `key-${nanoid(16)}-${trial.id}-${nanoid(5)}-${Date.now()}`,
            subscription_start_date: createdAt,
            subscription_end_date: trialEndDate
        });
        await this._mosquittoRepository.getMosquittoUrl(api_key);
        await this._redisRepository.delete(`trial:${user.email}`);
    }
    // End Trial Service
}

export default ProductService;
