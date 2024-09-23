import type { IAdmin } from "../../../../Common/models/types";
import { Pool } from "pg";

class AdminRepository {
    private readonly _pool: Pool;
    private readonly _photo: string;

    constructor(photo: string) {
        this._pool = new Pool();
        this._photo = photo;
    }

    async addAdmin(admin: IAdmin): Promise<string> {
        const createdAt = new Date();
        const adminQuery = {
            text: `
				INSERT INTO admins (
					id, 
					first_name, 
					last_name, 
					password, 
					email, 
					photo,
					created_at, 
					updated_at
				) 
				VALUES ($1, $2, $3, $4, $5, $6, $7, $7) 
				RETURNING id
			`,
            values: [
                admin.id,
                admin.first_name,
                admin.last_name,
                admin.password,
                admin.email,
                this._photo,
                createdAt
            ]
        };
        const adminResult = await this._pool.query(adminQuery);
        return adminResult.rows[0].id;
    }

    async getAdminById(id: string): Promise<IAdmin | null> {
        const adminQuery = {
            text: `
				SELECT id, first_name, last_name, password, email, photo
				FROM admins 
				WHERE id = $1
			`,
            values: [id]
        };
        const adminResult = await this._pool.query(adminQuery);
        return adminResult.rows[0] || null;
    }

    async getAdminByEmail(email: string): Promise<IAdmin | null> {
        const adminQuery = {
            text: `
				SELECT id, first_name, last_name, password, email, photo
				FROM admins 
				WHERE email = $1
			`,
            values: [email]
        };
        const adminResult = await this._pool.query(adminQuery);
        return adminResult.rows[0] || null;
    }

    async editAdmin(id: string, admin: IAdmin): Promise<string> {
        const updatedAt = new Date();
        const fields: string[] = [];
        const values: (string | number)[] = [];
        let index = 1;

        if (admin.first_name) {
            fields.push(`first_name = $${index++}`);
            values.push(admin.first_name);
        }
        if (admin.last_name) {
            fields.push(`last_name = $${index++}`);
            values.push(admin.last_name);
        }
        if (admin.email) {
            fields.push(`email = $${index++}`);
            values.push(admin.email);
        }
        if (fields.length === 0) {
            throw new Error("No fields to update");
        }

        const adminQuery = {
            text: `
                UPDATE admins 
                SET ${fields.join(", ")}, updated_at = $${index++} 
                WHERE id = $${index}
				RETURNING id
            `,
            values: [...values, updatedAt, id]
        };
        const adminResult = await this._pool.query(adminQuery);
        return adminResult.rows[0].id;
    }

    async editAdminPassword(id: string, password: string): Promise<string> {
        const updatedAt = new Date();
        const adminQuery = {
            text: `
                UPDATE admins 
                SET password = $1, updated_at = $2 
                WHERE id = $3
				RETURNING id
            `,
            values: [password, updatedAt, id]
        };
        const adminResult = await this._pool.query(adminQuery);
        return adminResult.rows[0].id;
    }

    async editAdminPhoto(id: string, photo: string): Promise<string> {
        const updatedAt = new Date();
        const adminQuery = {
            text: `
                UPDATE admins 
                SET photo = $1, updated_at = $2 
                WHERE id = $3
				RETURNING id
			`,
            values: [photo, updatedAt, id]
        };
        const adminResult = await this._pool.query(adminQuery);
        return adminResult.rows[0].id;
    }

    async deleteAdminById(id: string): Promise<void> {
        const adminQuery = {
            text: `DELETE FROM admins WHERE id = $1`,
            values: [id]
        };
        await this._pool.query(adminQuery);
    }

    async deleteAllAdmins(): Promise<void> {
        const adminQuery = {
            text: `DELETE FROM admins`
        };
        await this._pool.query(adminQuery);
    }
}

export default AdminRepository;
