// This plugin is not longer used

import { Pool } from "pg";
import Hapi from "@hapi/hapi";
import Config from "../../Infrastructure/settings/config";

const ExpirityPlugin = async (server: Hapi.Server) => {
    await server.register({
        plugin: {
            name: "expirity",
            register: async () => {
                const pool = new Pool();

                async function deleteSubscription(): Promise<void> {
                    const currentTime = new Date();
                    const subscriptionQuery = {
                        text: `DELETE FROM subscriptions WHERE subscription_end_date < $1 RETURNING *`,
                        values: [currentTime]
                    };
                    const result = await pool.query(subscriptionQuery);
                    const deletedCount = result.rowCount;
                    if (deletedCount === 0) {
                        return;
                    }
                    console.log(`Deleted ${deletedCount} expired subscription(s)`);
                }

                async function deleteOtp(): Promise<void> {
                    const currentTime = new Date();
                    const otpQuery = {
                        text: `DELETE FROM otp_codes WHERE otp_expires_at < $1 RETURNING *`,
                        values: [currentTime]
                    };
                    const result = await pool.query(otpQuery);
                    const deletedCount = result.rowCount;
                    if (deletedCount === 0) {
                        return;
                    }
                    console.log(`Deleted ${deletedCount} expired OTP code(s)`);
                }

                setInterval(async () => {
                    await deleteSubscription();
                    await deleteOtp();
                }, Config.timeOut.otp);
            }
        }
    });
};

export default ExpirityPlugin;
