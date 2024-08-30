import type { IProduct, ITrial } from "../../Common/models/types";
import { Pool } from "pg";

class ProductRepo {
	private readonly _pool: Pool;

	constructor() {
		this._pool = new Pool();
	}

	// Start Product Repository
	async addProduct(product: IProduct): Promise<IProduct> {
		const createdAt = new Date();
		const productQuery = {
			text: `
				INSERT INTO products (
					id, 
					product_name, 
					description, 
					price,
					duration,
					free_trial,
					created_at,
					updated_at
				) VALUES ($1, $2, $3, $4, $5, $6, $7, $7) RETURNING *`,
			values: [
				product.id,
				product.product_name,
				product.description,
				product.price,
				product.duration,
				product.free_trial,
				createdAt,
			]
		};

		const productResult = await this._pool.query<IProduct>(productQuery);
		return productResult.rows[0];
	}

    async getProducts(): Promise<IProduct[]> {
        const productQuery = {
            text: `SELECT id, product_name, description, price, duration, free_trial FROM products`,
        };
        const productResult = await this._pool.query<IProduct>(productQuery);
        return productResult.rows;
    }

    async getProductById(id: string): Promise<IProduct | null> {
        const productQuery = {
            text: `SELECT id, product_name, description, price, duration, free_trial FROM products WHERE id = $1`,
            values: [id]
        };
        const productResult = await this._pool.query<IProduct>(productQuery);
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
		if (product.free_trial) {
			fields.push(`free_trial = $${index++}`);
			values.push(product.free_trial ? 1 : 0);
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
	async addTrialByUserId(userId: string, trial: ITrial): Promise<string> {
		const createdAt = new Date();
		const trialQuery = {
			text: `
				INSERT INTO trials (
					id, 
					user_id, 
					free_trial,
					created_at,
					updated_at
				) VALUES ($1, $2, $3, $4, $4) RETURNING id`,
			values: [
				trial.id,
				userId,
				trial.free_trial,
				createdAt,
			]
		};
		const trialResult = await this._pool.query(trialQuery);
		return trialResult.rows[0].id;
	}

	async getTrialByUserId(userId: string): Promise<ITrial | null> {
		const trialQuery = {
			text: `
				SELECT 
					id, 
					user_id, 
					free_trial, 
					created_at, 
					updated_at 
				FROM trials 
				WHERE user_id = $1
			`,
			values: [userId]
		};
		const trialResult = await this._pool.query(trialQuery);
		return trialResult.rows[0] || null;
	}

	async updateTrialByUserId(userId: string, trial: ITrial): Promise<string> {
		const updatedAt = new Date();
		const trialQuery = {
			text: `
				UPDATE trials 
				SET free_trial = $1, updated_at = $2 
				WHERE user_id = $3 
				RETURNING id
			`,
			values: [trial.free_trial, updatedAt, userId]
		};
		const trialResult = await this._pool.query(trialQuery);
		return trialResult.rows[0].id;
	}
	// End Trial Repository
}

export default ProductRepo;
