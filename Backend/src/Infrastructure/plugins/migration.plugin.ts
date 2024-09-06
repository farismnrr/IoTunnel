import fs from "fs";
import path from "path";
import Hapi from "@hapi/hapi";
import { Pool } from "pg";

const MigrationPlugin = async (server: Hapi.Server) => {
	await server.register({
		plugin: {
			name: "migration",
			register: async () => {
				const pool = new Pool();

				async function migrate() {
					try {
						await pool.query("BEGIN");

						const migrations: string[] = [
							`create-users-table.sql`,
							`create-admins-table.sql`,
							`create-auths-table.sql`,
							`create-otp-codes-table.sql`,
							`create-trials-table.sql`,
							`create-products-table.sql`,
							`create-items-table.sql`,
							`create-orders-table.sql`,
							`create-subscriptions-table.sql`,
							`create-topics-table.sql`,
							`create-components-table.sql`
						];

						for (const migration of migrations) {
							const filePath = path.resolve(__dirname, `../../../migrations/${migration}`);
							const fileContent = await fs.promises.readFile(filePath, "utf8");
							console.log(`Executing migration: ${migration}`);
							// console.log(fileContent);
							const queries = fileContent.split(`;`);

							for (const query of queries) {
								if (query.trim() !== "") {
									await pool.query(query);
								}
							}
						}
						await pool.query("COMMIT");
						console.log("All migrations executed successfully!");
					} catch (err) {
						await pool.query("ROLLBACK");
						console.error(err);
						console.log("Error executing migrations!");
					}
				}

				await migrate();
			}
		}
	});
};

export default MigrationPlugin;
