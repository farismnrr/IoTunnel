import { Pool } from "pg";
import Hapi from "@hapi/hapi";
import bcrypt from "bcrypt";
import MosquittoRepository from "../repositories/external/mosquitto.repo";

const ExpirityPlugin = async (server: Hapi.Server) => {
	await server.register({
		plugin: {
			name: "expirity",
			register: async () => {
				const pool = new Pool();
				const mosquittoRepository = new MosquittoRepository();

				async function deleteSubscription(): Promise<void> {
					const currentTime = new Date();
					const getSubscriptionQuery = {
						text: `SELECT user_id FROM subscriptions WHERE subscription_end_date < $1`,
						values: [currentTime]
					};
					const subscription = await pool.query(getSubscriptionQuery); // <-- Array
					subscription.rows.forEach(async row => {
						const hashedUserId = await bcrypt.hash(row.user_id, 10);
						await mosquittoRepository.deleteMosquittoUrl(hashedUserId, row.user_id); // <-- Single ID
						console.log(`Mosquitto Password deleted from ${row.user_id}`);
					});

					const subscriptionQuery = {
						text: `DELETE FROM subscriptions WHERE subscription_end_date < $1`,
						values: [currentTime]
					};
					await pool.query(subscriptionQuery);
				}

				async function deleteOtp(): Promise<void> {
					const currentTime = new Date();
					const otpQuery = {
						text: `DELETE FROM otp_codes WHERE otp_expires_at < $1`,
						values: [currentTime]
					};
					await pool.query(otpQuery);
				}

				setInterval(async () => {
					await deleteSubscription();
					await deleteOtp();
				}, 1 * 1000);
			}
		}
	});
};

export default ExpirityPlugin;
