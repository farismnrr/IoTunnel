import fs from "fs";
import path from "path";
import { Pool } from "pg";

async function migrate() {
    try {
        const pool = new Pool();
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
            `create-projects-table.sql`,
            `create-components-table.sql`,
            `create-user-project-updates-table.sql`,
            `add-products.sql`,
            `add-items.sql`,
            `add-users-admins.sql`
        ];

        for (const migration of migrations) {
            const filePath = path.resolve(`migrations/${migration}`);
            const fileContent = await fs.promises.readFile(filePath, "utf8");
            console.log(`Executing migration: ${migration}`);
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
        console.error(err);
        console.log("Error executing migrations!");
    }
}

await migrate();
