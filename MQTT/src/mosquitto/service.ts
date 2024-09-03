import type { WebhookResponse } from "../utils/models";
import MosquittoRepository from "./repository";
import { exec } from "child_process";

class MosquittoService {
	private readonly _mosquittoRepository: MosquittoRepository;

	constructor(mosquittoRepository: MosquittoRepository) {
		this._mosquittoRepository = mosquittoRepository;
	}

	async updateMosquittoPassword(data: WebhookResponse): Promise<void> {
		const command = `sudo mosquitto_passwd -b /etc/mosquitto/passwd ${data.user_id} ${data.api_key}`;
			exec(command, (error: Error | null) => {
				if (error) {
					console.error(`Error executing command: ${error.message}`);
					return;
			}
		});
		const command2 = `sudo systemctl restart mosquitto`;
		exec(command2, (error: Error | null) => {
			if (error) {
				console.error(`Error executing command: ${error.message}`);
				return;
			}
		});
		console.log("Successfully updated mosquitto password");
	}

	async deleteMosquittoPassword(userId: string): Promise<void> {
		const command = `sudo mosquitto_passwd -D /etc/mosquitto/passwd ${userId}`;
			exec(command, (error: Error | null) => {
				if (error) {
					console.error(`Error executing command: ${error.message}`);
					return;
			}
		});

		const command2 = `sudo systemctl restart mosquitto`;
		exec(command2, (error: Error | null) => {
			if (error) {
				console.error(`Error executing command: ${error.message}`);
				return;
			}
		});
		console.log("Successfully deleted mosquitto password");
	}

	async postPassword(apiKey: string): Promise<void> {
		if (!apiKey) {
			throw new Error("API key is required");
		}
		const data = await this._mosquittoRepository.getWebhook(apiKey);
		await this.updateMosquittoPassword(data);
	}

	async deletePassword(apiKey: string, userId: string): Promise<void> {
		if (!apiKey) {
			throw new Error("API key is required");
		}

		await this.deleteMosquittoPassword(userId);
	}
}

export default MosquittoService;
