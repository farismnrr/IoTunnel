import fs from "fs";
import path from "path";
import AuthRepository from "../repositories/server/auth.repo";
import { Pool } from "pg";

class MigrationPlugin {
	private pool: Pool;

	constructor() {
		this.pool = new Pool();
	}

	async migrate() {
		try {
			await this.pool.query("BEGIN");

			const migrations: string[] = [
				`create-users-table.sql`,
				`create-admins-table.sql`,
				`create-auths-table.sql`,
				`create-otp-codes-table.sql`,
				`create-trials-table.sql`,
				`create-products-table.sql`,
				`create-orders-table.sql`,
				`create-subscriptions-table.sql`
			];

			for (const migration of migrations) {
				const filePath = path.resolve(__dirname, `../../../migrations/${migration}`);
				const fileContent = await fs.promises.readFile(filePath, "utf8");
				console.log(`Executing migration: ${migration}`);
				// console.log(fileContent);
				const queries = fileContent.split(`;`);

				for (const query of queries) {
					if (query.trim() !== "") {
						await this.pool.query(query);
					}
				}
			}

			await this.pool.query("COMMIT");
			console.log("All migrations executed successfully!");
		} catch (err) {
			await this.pool.query("ROLLBACK");
			console.error(err);
			console.log("Error executing migrations!");
		}
	}

	async expirity() {
		const authRepository = new AuthRepository();
		setInterval(async () => {
			await authRepository.deleteOtp();
		}, 5 * 60 * 1000);
	}
}

export default MigrationPlugin;
