import { Pool } from "pg";
import Hapi from "@hapi/hapi";

const ExpirityPlugin = async (server: Hapi.Server) => {
	await server.register({
		plugin: {
			name: "expirity",
			register: async () => {
				const pool = new Pool();

				async function deleteSubscription(): Promise<void> {
					const currentTime = new Date();
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
				}, 60 * 1000);
			}
		}
	});
};

export default ExpirityPlugin;
