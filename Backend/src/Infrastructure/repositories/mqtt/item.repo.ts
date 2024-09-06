import type { IItem } from "../../../Common/models/types/entities/item.types";
import { Pool } from "pg";

class ItemRepo {
	private readonly _pool: Pool;

	constructor() {
		this._pool = new Pool();
	}

	async createItem(item: IItem): Promise<string> {
		const query = {
			text: `
                INSERT INTO items (id, name, pin_type) 
                VALUES ($1, $2, $3) 
                RETURNING id
            `,
			values: [item.id, item.name, item.pin_type]
		};
		const result = await this._pool.query(query);
		return result.rows[0].id;
	}

	async getItems(): Promise<IItem[]> {
		const query = {
			text: "SELECT id, name, pin_type FROM items"
		};
		const result = await this._pool.query(query);
		return result.rows;
	}

	async getItemById(id: string): Promise<IItem> {
		const query = {
			text: "SELECT id, name, pin_type FROM items WHERE id = $1",
			values: [id]
		};
		const result = await this._pool.query(query);
		return result.rows[0];
	}

	async getItemByName(name: string): Promise<IItem> {
		const query = {
			text: "SELECT id, name, pin_type FROM items WHERE name = $1",
			values: [name]
		};
		const result = await this._pool.query(query);
		return result.rows[0];
	}

	async updateItem(id: string, item: IItem): Promise<void> {
		const itemQuery = {
			text: "UPDATE items SET name = $1, pin_type = $2 WHERE id = $3",
			values: [item.name, item.pin_type, id]
		};
		await this._pool.query(itemQuery);
	}

	async deleteItem(id: string): Promise<void> {
		const deleteQuery = {
			text: "DELETE FROM items WHERE id = $1",
			values: [id]
		};
		await this._pool.query(deleteQuery);
	}
}

export default ItemRepo;
