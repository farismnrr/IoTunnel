import type { ISubscription } from "../../../../Common/models/types";
import { Pool } from "pg";

class SubscriptionRepository {
    private readonly _pool: Pool;
    constructor() {
        this._pool = new Pool();
    }

    async addSubscription(userId: string, subscription: Partial<ISubscription>): Promise<void> {
        const subscriptionQuery = {
            text: `
				INSERT INTO subscriptions (
					id, 
					user_id, 
					product_id, 
					trial_id,
					api_key, 
					subscription_start_date, 
					subscription_end_date
				) VALUES ($1, $2, $3, $4, $5, $6, $7)
				RETURNING id
			`,
            values: [
                subscription.id,
                userId,
                subscription.product_id,
                subscription.trial_id,
                subscription.api_key,
                subscription.subscription_start_date,
                subscription.subscription_end_date
            ]
        };

        await this._pool.query(subscriptionQuery);
    }

    async getSubscriptions(): Promise<ISubscription[]> {
        const subscriptionQuery = {
            text: `
				SELECT 
					id, 
					user_id, 
					product_id, 
					trial_id, 
					api_key, 
					subscription_start_date, 
					subscription_end_date 
				FROM subscriptions
			`
        };

        const subscriptionResult = await this._pool.query(subscriptionQuery);
        return subscriptionResult.rows;
    }

    async getSubscriptionByUserId(userId: string): Promise<ISubscription> {
        const subscriptionQuery = {
            text: `
				SELECT 
					id, 
					user_id, 
					product_id, 
					trial_id,
					api_key,
					subscription_start_date,
					subscription_end_date
				FROM subscriptions
				WHERE user_id = $1
			`,
            values: [userId]
        };

        const subscriptionResult = await this._pool.query(subscriptionQuery);
        return subscriptionResult.rows[0];
    }

    async getSubscriptionEndDate(userId: string): Promise<string | null> {
        const subscriptionQuery = {
            text: `
				SELECT 
					subscription_end_date 
				FROM subscriptions
				WHERE user_id = $1
			`,
            values: [userId]
        };

        const subscriptionResult = await this._pool.query(subscriptionQuery);
        if (!subscriptionResult.rows.length) {
            return null;
        }
        return subscriptionResult.rows[0].subscription_end_date;
    }

    async getSubscriptionByApiKey(apiKey: string): Promise<ISubscription> {
        const subscriptionQuery = {
            text: `
				SELECT 
					id, 
					user_id, 
					product_id, 
					trial_id,
					api_key,
					subscription_start_date,
					subscription_end_date
				FROM subscriptions
				WHERE api_key = $1
			`,
            values: [apiKey]
        };

        const subscriptionResult = await this._pool.query(subscriptionQuery);
        return subscriptionResult.rows[0];
    }
}

export default SubscriptionRepository;
