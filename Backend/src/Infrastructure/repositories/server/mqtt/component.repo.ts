import type { IComponent } from "../../../../Common/models/types";
import { Pool } from "pg";
import { NotFoundError } from "../../../../Common/errors";

class ComponentRepository {
    private readonly _pool: Pool;

    constructor() {
        this._pool = new Pool();
    }

    async addComponent(component: IComponent): Promise<void> {
        const createdAt = new Date();
        const componentQuery = {
            text: `
            INSERT INTO components (id, name, item_id, topic_id, project_id, user_id, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
            RETURNING id
        `,
            values: [
                component.id,
                component.name,
                component.item_id,
                component.topic_id,
                component.project_id,
                component.user_id,
                createdAt
            ]
        };
        await this._pool.query(componentQuery);
    }

    async checkComponentItem(itemId: string, userId: string, projectId: string): Promise<boolean> {
        const checkComponentItemQuery = {
            text: `
                SELECT COUNT(*)
                FROM components
                WHERE item_id = $1 AND user_id = $2 AND project_id = $3
            `,
            values: [itemId, userId, projectId]
        };
        const checkComponentItemResult = await this._pool.query(checkComponentItemQuery);
        return checkComponentItemResult.rows[0].count > 0;
    }

    async getComponentByItemId(itemId: string): Promise<IComponent[]> {
        const getComponentByItemIdQuery = {
            text: `
                SELECT topic_id, user_id, project_id
                FROM components
                WHERE item_id = $1
            `,
            values: [itemId]
        };
        const getComponentByItemIdResult = await this._pool.query(getComponentByItemIdQuery);
        if (!getComponentByItemIdResult.rowCount) {
            throw new NotFoundError("Component not found");
        }
        return getComponentByItemIdResult.rows;
    }

    async getComponentById(id: string): Promise<IComponent> {
        const getComponentByIdQuery = {
            text: `
				SELECT id, name, item_id, topic_id, user_id, project_id
				FROM components
				WHERE id = $1
			`,
            values: [id]
        };
        const getComponentByIdResult = await this._pool.query(getComponentByIdQuery);
        return getComponentByIdResult.rows[0];
    }

    async getComponentByProjectId(projectId: string): Promise<IComponent[]> {
        const getComponentByProjectIdQuery = {
            text: `
				SELECT id, name, item_id, topic_id, user_id, project_id
				FROM components
				WHERE project_id = $1
			`,
            values: [projectId]
        };
        const getComponentByProjectIdResult = await this._pool.query(getComponentByProjectIdQuery);
        return getComponentByProjectIdResult.rows;
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
            `,
            values: [...values, updatedAt, id]
        };

        await this._pool.query(updateComponentQuery);
    }

    async deleteComponent(id: string): Promise<void> {
        const deleteComponentQuery = `
            DELETE FROM components
            WHERE id = $1
        `;
        const values = [id];
        await this._pool.query(deleteComponentQuery, values);
    }
}

export default ComponentRepository;
