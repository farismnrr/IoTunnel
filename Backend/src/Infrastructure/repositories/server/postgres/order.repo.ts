import type { IOrder } from "../../../../Common/models/types";
import { Pool } from "pg";

class OrderRepo {
	private _pool: Pool;

	constructor() {
		this._pool = new Pool();
	}

	async createOrder(userId: string, productId: string, order: Partial<IOrder>): Promise<string> {
		const createdAt = new Date();
		const orderQuery = {
			text: `
                INSERT INTO orders 
                (id, user_id, product_id, status, token, payment_url, created_at, updated_at) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $7) 
                RETURNING *
            `,
			values: [
				order.id,
				userId,
				productId,
				order.status,
				order.token,
				order.payment_url,
				createdAt
			]
		};
		const orderResult = await this._pool.query(orderQuery);
		return orderResult.rows[0].id;
	}

	async getOrderById(orderId: string): Promise<IOrder> {
		const orderQuery = {
			text: `
                SELECT id, user_id, product_id, status, token, payment_url FROM orders WHERE id = $1
            `,
			values: [orderId]
		};
		const orderResult = await this._pool.query(orderQuery);
		return orderResult.rows[0];
	}

	async editOrderStatus(orderId: string, status: string): Promise<string> {
		const updatedAt = new Date();
		const orderQuery = {
			text: `
                UPDATE orders 
                SET status = $1, updated_at = $2 
                WHERE id = $3
            `,
			values: [status, updatedAt, orderId]
		};
		await this._pool.query(orderQuery);
		return status;
	}
}

export default OrderRepo;
