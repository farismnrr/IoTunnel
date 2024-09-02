import type { IProduct, ITrial } from "../../../Common/models/types";
import { Pool } from "pg";

class ProductRepo {
	private readonly _pool: Pool;

	constructor() {
		this._pool = new Pool();
	}

	// Start Product Repository
	async addProduct(product: IProduct): Promise<string> {
		const createdAt = new Date();
		const productQuery = {
			text: `
				INSERT INTO products (
					id, 
					product_name, 
					description, 
					price,
					duration,
					created_at,
					updated_at
				) VALUES ($1, $2, $3, $4, $5, $6, $6) RETURNING *`,
			values: [
				product.id,
				product.product_name,
				product.description,
				product.price,
				product.duration,
				createdAt
			]
		};

		const productResult = await this._pool.query(productQuery);
		return productResult.rows[0].id;
	}

	async getProducts(): Promise<IProduct[]> {
		const productQuery = {
			text: `SELECT id, product_name, description, price, duration FROM products`
		};
		const productResult = await this._pool.query(productQuery);
		return productResult.rows;
	}

	async getProductById(id: string): Promise<IProduct | null> {
		const productQuery = {
			text: `SELECT id, product_name, description, price, duration FROM products WHERE id = $1`,
			values: [id]
		};
		const productResult = await this._pool.query(productQuery);
		return productResult.rows[0] || null;
	}

	async updateProduct(id: string, product: IProduct): Promise<string> {
		const updatedAt = new Date();
		const fields: string[] = [];
		const values: (string | number)[] = [];
		let index = 1;

		if (product.product_name) {
			fields.push(`product_name = $${index++}`);
			values.push(product.product_name);
		}
		if (product.description) {
			fields.push(`description = $${index++}`);
			values.push(product.description);
		}
		if (product.price) {
			fields.push(`price = $${index++}`);
			values.push(product.price);
		}
		if (product.duration) {
			fields.push(`duration = $${index++}`);
			values.push(product.duration);
		}
		if (fields.length === 0) {
			throw new Error("No fields to update");
		}

		const productQuery = {
			text: `
                UPDATE products 
                SET ${fields.join(", ")}, updated_at = $${index++} 
                WHERE id = $${index}
				RETURNING id
            `,
			values: [...values, updatedAt, id]
		};

		const productResult = await this._pool.query(productQuery);
		return productResult.rows[0].id;
	}

	async deleteProduct(id: string): Promise<void> {
		const productQuery = {
			text: `DELETE FROM products WHERE id = $1`,
			values: [id]
		};
		await this._pool.query(productQuery);
	}
	// End Product Repository

	// Start Trial Repository
	async addTrialByUserEmail(id: string, email: string, trial: boolean): Promise<void> {
		const createdAt = new Date();
		const trialQuery = {
			text: `
				INSERT INTO trials (
					id,
					email, 
					free_trial,
					created_at,
					updated_at
				) VALUES ($1, $2, $3, $4, $4)`,
			values: [id, email, trial, createdAt]
		};
		await this._pool.query(trialQuery);
	}

	async getTrialByUserEmail(email: string): Promise<ITrial | null> {
		const trialQuery = {
			text: `
				SELECT 
					id,
					email, 
					free_trial
				FROM trials 
				WHERE email = $1
			`,
			values: [email]
		};
		const trialResult = await this._pool.query(trialQuery);
		return trialResult.rows[0];
	}

	async updateTrialByUserEmail(email: string, trial: ITrial): Promise<void> {
		const updatedAt = new Date();
		const trialQuery = {
			text: `
				UPDATE trials 
				SET free_trial = $1, updated_at = $2 
				WHERE email = $3
			`,
			values: [trial.free_trial, updatedAt, email]
		};
		await this._pool.query(trialQuery);
	}
	// End Trial Repository
}

export default ProductRepo;
