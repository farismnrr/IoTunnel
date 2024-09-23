import { Pool } from "pg";

class TopicRepository {
    private readonly _pool: Pool;
    constructor() {
        this._pool = new Pool();
    }

    // Start Topic Repository
    async addTopic(id: string): Promise<string> {
        const createdAt = new Date();
        const topicQuery = {
            text: `
				INSERT INTO topics (
					id, 
					created_at, 
					updated_at
				) VALUES ($1, $2, $2) RETURNING id
				`,
            values: [id, createdAt]
        };
        const result = await this._pool.query(topicQuery);
        return result.rows[0].id;
    }

    async deleteTopicById(id: string): Promise<void> {
        const deleteQuery = {
            text: `
				DELETE FROM topics 
                WHERE id = $1
			`,
            values: [id]
        };
        await this._pool.query(deleteQuery);
    }
    // End Topic Repository
}

export default TopicRepository;
