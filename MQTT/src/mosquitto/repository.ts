import config from "../utils/config";
import type { WebhookResponse } from "../utils/models";

class MosquittoRepository {
	async getWebhook(apiKey: string): Promise<WebhookResponse> {
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: apiKey,
			},
		};

		const response = await fetch(`${config.mosquitto.apiUrl}/orders/subscription`, options);
		const data = await response.json();
		return data.data;
	}
}

export default MosquittoRepository;
