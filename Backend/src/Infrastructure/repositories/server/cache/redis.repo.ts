import redis from "redis";
import config from "../../../settings/config";

class RedisRepository {
    private readonly _client: redis.RedisClientType;

    constructor() {
        this._client = redis.createClient({
            socket: {
                host: config.redis.host,
                port: Number(config.redis.port)
            }
        });

        this._client.on("error", (error: Error) => {
            console.error(error);
        });

        this._client.connect();
    }

    async set(key: string, value: unknown, expirationInSecond = 1800) {
        await this._client.set(key, JSON.stringify(value), {
            EX: expirationInSecond
        });
    }

    async get(key: string) {
        const result = await this._client.get(key);
        return result;
    }

    async delete(key: string) {
        return this._client.del(key);
    }
}

export default RedisRepository;
