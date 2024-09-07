import type { IComponent } from "../../../Common/models/types";
import { Pool } from "pg";
import { NotFoundError } from "../../../Common/errors";

class ComponentRepository {
	private pool: Pool;

	constructor() {
		this.pool = new Pool();
	}

	async addComponent(component: IComponent): Promise<void> {
		const createdAt = new Date();
		const componentQuery = `
            INSERT INTO components (id, name, item_id, topic_id, user_id, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $6)
            RETURNING id
        `;
		const values = [
			component.id,
			component.name,
			component.item_id,
			component.topic_id,
			component.user_id,
			createdAt
		];
		const componentResult = await this.pool.query(componentQuery, values);
		return componentResult.rows[0].id;
	}

	async checkComponentItem(itemId: string, userId: string): Promise<boolean> {
		const checkComponentItemQuery = {
			text: `
                SELECT COUNT(*)
                FROM components
                WHERE item_id = $1 AND user_id = $2
            `,
			values: [itemId, userId]
		};
		const checkComponentItemResult = await this.pool.query(checkComponentItemQuery);
		return checkComponentItemResult.rows[0].count > 0;
	}

	async getComponentByItemId(itemId: string): Promise<IComponent[]> {
        const getComponentByItemIdQuery = {
			text: `
                SELECT topic_id, user_id
                FROM components
                WHERE item_id = $1
            `,
			values: [itemId]
		};
		const getComponentByItemIdResult = await this.pool.query(getComponentByItemIdQuery);
		if (!getComponentByItemIdResult.rowCount) {
			throw new NotFoundError("Component not found");
		}
		return getComponentByItemIdResult.rows;
	}

	async getComponentById(id: string): Promise<IComponent> {
		const getComponentByIdQuery = `
            SELECT id, name, item_id, topic_id, user_id
            FROM components
            WHERE id = $1
        `;
		const values = [id];
		const getComponentByIdResult = await this.pool.query(getComponentByIdQuery, values);
		return getComponentByIdResult.rows[0];
	}

	async updateComponent(id: string, name: string, itemId: string): Promise<void> {
		const updatedAt = new Date();
		const fields: string[] = [];
		const values: (string | number)[] = [];
		let index = 1;

		if (name) {
			fields.push(`name = $${index++}`);
			values.push(name);
		}
		if (itemId) {
			fields.push(`item_id = $${index++}`);
			values.push(itemId);
		}

		const updateComponentQuery = {
			text: `
                UPDATE components 
                SET ${fields.join(", ")}, updated_at = $${index++} 
                WHERE id = $${index}
				RETURNING id
            `,
			values: [...values, updatedAt, id]
		};

		const updateComponentResult = await this.pool.query(updateComponentQuery);
		return updateComponentResult.rows[0].id;
	}

	async deleteComponent(id: string): Promise<void> {
		const deleteComponentQuery = `
            DELETE FROM components
            WHERE id = $1
        `;
		const values = [id];
		await this.pool.query(deleteComponentQuery, values);
	}
}

export default ComponentRepository;
