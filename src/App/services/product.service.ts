import type { IProduct, ITrial } from "../../Common/models/types";
import ProductRepository from "../../Infrastructure/repositories/product.repo";
import UserRepository from "../../Infrastructure/repositories/user.repo";
import AuthRepository from "../../Infrastructure/repositories/auth.repo";
import { v4 as uuidv4 } from "uuid";
import { NotFoundError, AuthorizationError, InvariantError } from "../../Common/errors";

class ProductService {
	private readonly _productRepository: ProductRepository;
	private readonly _userRepository: UserRepository;
	private readonly _authRepository: AuthRepository;

	constructor(
		productRepository: ProductRepository,
		userRepository: UserRepository,
		authRepository: AuthRepository
	) {
		this._productRepository = productRepository;
		this._userRepository = userRepository;
		this._authRepository = authRepository;
	}

	// Start Product Service
	async addProduct(adminId: string, payload: IProduct): Promise<string> {
		const id = uuidv4();
		const adminRole = await this._authRepository.getAdminRole(adminId);
		if (adminRole !== "admin") {
			throw new AuthorizationError("You are not authorized to add this product");
		}

		const product = await this._productRepository.addProduct({
			...payload,
			id
		});
		return product.id;
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
		const trial = await this._productRepository.getTrialByUserEmail(email);
		if (trial) {
			return false;
		}
		const id = uuidv4();
		const trialId = await this._productRepository.addTrialByUserEmail(email, {
			id,
			email: email,
			free_trial: true
		});

		if (!trialId) {
			throw new InvariantError("Failed to add trial");
		}
		return true;
	}

	async getTrialByUserId(userId: string): Promise<ITrial | null> {
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
		return trial;
	}

	async editTrialByUserId(userId: string): Promise<void> {
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

		await this._productRepository.updateTrialByUserEmail(user.email, {
			...trial,
			free_trial: false
		});
	}
	// End Trial Service
}

export default ProductService;
