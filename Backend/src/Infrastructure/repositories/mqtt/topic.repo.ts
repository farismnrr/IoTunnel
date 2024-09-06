import type { ITopic, ITopicWithApiKey } from "../../../Common/models/types";
import { Pool } from "pg";

class TopicRepository {
	private readonly _pool: Pool;
	constructor() {
		this._pool = new Pool();
	}

	// Start Topic Repository
	async addTopic(topic: ITopic): Promise<string> {
		const createdAt = new Date();
		const topicQuery = {
			text: `
                INSERT INTO topics (
                    id, 
                    subscription_id, 
                    created_at, 
                    updated_at
                ) VALUES ($1, $2, $3, $3)
            `,
			values: [topic.id, topic.subscription_id, createdAt]
		};
		const result = await this._pool.query(topicQuery);
		return result.rows[0].id;
	}

	async getTopicByApiKey(apiKey: string): Promise<ITopicWithApiKey[]> {
		const joinQuery = {
			text: `
				SELECT topics.id, topics.subscription_id, subscriptions.api_key 
                FROM topics 
                JOIN subscriptions 
                ON topics.subscription_id = subscriptions.id 
                WHERE subscriptions.api_key = $1
			`,
			values: [apiKey]
		};
		const result = await this._pool.query(joinQuery);
		const topic = result.rows;

		return topic;
	}

	async deleteTopicByApiKey(apiKey: string): Promise<void> {
		const deleteQuery = {
			text: `
				DELETE FROM topics 
                WHERE subscription_id = (
                    SELECT id FROM subscriptions WHERE api_key = $1
                )
			`,
			values: [apiKey]
		};
		await this._pool.query(deleteQuery);
	}
	// End Topic Repository
}

export default TopicRepository;
