import { Pool } from "pg";
import Hapi from "@hapi/hapi";
import Config from "../../Infrastructure/settings/config";
import MosquittoRepository from "../repositories/external/mosquitto.repo";

const ExpirityPlugin = async (server: Hapi.Server) => {
	await server.register({
		plugin: {
			name: "expirity",
			register: async () => {
				const pool = new Pool();
				const mosquittoRepository = new MosquittoRepository();
				const serverKey = Config.jwt.serverKey as string;

				async function deleteMosquittoUser(): Promise<void> {
					const connection = await mosquittoRepository.getMosquittoConnection();
					if (connection !== 200) {
						console.error("Failed to get Mosquitto Connection");
						return;
					}
					const user = await mosquittoRepository.getMosquittoUser(serverKey); // <-- Array
					if (user.length === 0) {
						console.log("No user found");
					}
					for (const userId of user) {
						if (!userId) {
							return;
						}
						const subscriptionQuery = {
							text: `SELECT user_id FROM subscriptions WHERE user_id = $1`,
							values: [userId]
						};
						const subscription = await pool.query(subscriptionQuery);
						if (!subscription.rowCount) {
							await mosquittoRepository.deleteMosquittoUrl(serverKey, userId);
							console.log(`Mosquitto Password deleted for user: ${userId}`);
							return;
						}
					}
				}

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
					await deleteMosquittoUser();
					await deleteSubscription();
					await deleteOtp();
				}, 1 * 1000);
			}
		}
	});
};

export default ExpirityPlugin;
