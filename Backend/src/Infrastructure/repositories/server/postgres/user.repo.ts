import type { IUser } from "../../../../Common/models/types";
import { Pool } from "pg";

class UserRepository {
	private readonly _pool: Pool;
	private readonly _photo: string;

	constructor(photo: string) {
		this._pool = new Pool();
		this._photo = photo;
	}

	async addUser(user: IUser): Promise<string> {
		const createdAt = new Date();
		const userQuery = {
			text: `
                INSERT INTO users (
                    id, 
                    first_name, 
                    last_name, 
                    password, 
                    email, 
                    phone_number, 
                    photo,
                    created_at,
                    updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
                RETURNING id
            `,
			values: [
				user.id,
				user.first_name,
				user.last_name,
				user.password,
				user.email,
				user.phone_number,
				this._photo,
				createdAt
			]
		};

		const userResult = await this._pool.query(userQuery);
		return userResult.rows[0].id;
	}

	async getUserById(id: string): Promise<IUser> {
		const userQuery = {
			text: `
                SELECT id, first_name, last_name, password, email, phone_number, photo
                FROM users
                WHERE id = $1
            `,
			values: [id]
		};

		const userResult = await this._pool.query(userQuery);
		return userResult.rows[0];
	}

	async getUserByEmail(email: string): Promise<IUser | null> {
		const userQuery = {
			text: `
                SELECT id, first_name, last_name, password, email, phone_number, photo
                FROM users
                WHERE email = $1
            `,
			values: [email]
		};

		const userResult = await this._pool.query(userQuery);
		return userResult.rows[0] || null;
	}

	async editUser(id: string, user: IUser): Promise<string> {
		const updatedAt = new Date();
		const fields: string[] = [];
		const values: (string | number)[] = [];
		let index = 1;

		if (user.first_name) {
			fields.push(`first_name = $${index++}`);
			values.push(user.first_name);
		}
		if (user.last_name) {
			fields.push(`last_name = $${index++}`);
			values.push(user.last_name);
		}
		if (user.email) {
			fields.push(`email = $${index++}`);
			values.push(user.email);
		}
		if (user.phone_number) {
			fields.push(`phone_number = $${index++}`);
			values.push(user.phone_number);
		}
		if (fields.length === 0) {
			throw new Error("No fields to update");
		}

		const userQuery = {
			text: `
                UPDATE users 
                SET ${fields.join(", ")}, updated_at = $${index++} 
                WHERE id = $${index}
                RETURNING id
            `,
			values: [...values, updatedAt, id]
		};

		const userResult = await this._pool.query(userQuery);
		return userResult.rows[0].id;
	}

	async editUserPassword(id: string, password: string): Promise<string> {
		const updatedAt = new Date();
		const userQuery = {
			text: `
                UPDATE users 
                SET password = $1, updated_at = $2 
                WHERE id = $3
                RETURNING id
            `,
			values: [password, updatedAt, id]
		};
		const userResult = await this._pool.query(userQuery);
		return userResult.rows[0].id;
	}

	async editUserPhoto(id: string, photo: string): Promise<string> {
		const updatedAt = new Date();
		const userQuery = {
			text: `
                UPDATE users 
                SET photo = $1, updated_at = $2 
                WHERE id = $3
                RETURNING id
            `,
			values: [photo, updatedAt, id]
		};
		const userResult = await this._pool.query(userQuery);
		return userResult.rows[0].id;
	}

	async deleteUserById(id: string): Promise<void> {
		const userQuery = {
			text: `DELETE FROM users WHERE id = $1`,
			values: [id]
		};
		await this._pool.query(userQuery);
	}

	async deleteAllUsers(): Promise<void> {
		const userQuery = {
			text: `DELETE FROM users`
		};
		await this._pool.query(userQuery);
	}
}

export default UserRepository;
