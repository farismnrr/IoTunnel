import config from "../utils/config";
import type { WebhookResponse } from "../utils/models";

class MosquittoRepository {
	async getServerConnection(): Promise<void> {
		try {
			const options = {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			};
			await fetch(`${config.mosquitto.apiUrl}`, options);
		} catch (error) {
			console.error("Failed to get Mosquitto Connection:", error);
		}
	}
	
	async getWebhook(apiKey: string): Promise<WebhookResponse> {
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: apiKey,
			},
		};
		const response = await fetch(
			`${config.mosquitto.apiUrl}/api/v1/orders/subscription`,
			options
		);
		if (response.status !== 200) {
			console.log("Failed to fetch webhook");
			throw new Error("Failed to fetch webhook");
		}
		const data = await response.json();
		return data.data;
	}
}

export default MosquittoRepository;
