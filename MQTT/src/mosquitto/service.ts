import fetch from "node-fetch";
import { spawn } from "child_process";
import fs from "fs";

interface SubscriptionData {
	data: {
		user_id: string;
		api_key: string;
	}[];
}

class MosquittoService {
	private url: string;
	private filePath: string;

	constructor() {
		this.url = process.env.API_ENDPOINT + "/api/v1/orders/subscription" || "";
		this.filePath = "/etc/mosquitto/passwd";
	}

	async createFileIfNotExists() {
		if (!fs.existsSync(this.filePath)) {
			const createFileChild = spawn("sudo", ["touch", this.filePath]);
			await new Promise((resolve, reject) => {
				createFileChild.on("close", code => {
					if (code === 0) {
						resolve(void 0);
					} else {
						reject(new Error(`Failed to create file: ${code}`));
					}
				});
			});
		}
	}

	async updateMosquittoPassword(userId: string, apiKey: string) {
		const child = spawn("sudo", ["mosquitto_passwd", "-b", this.filePath, userId, apiKey]);
		await new Promise((resolve, reject) => {
			child.on("close", code => {
				if (code === 0) {
					resolve(void 0);
				} else {
					reject(new Error(`Failed to update Mosquitto password: ${code}`));
				}
			});
		});
	}

	async restartMosquittoService() {
		const restartChild = spawn("sudo", ["systemctl", "restart", "mosquitto"]);
		await new Promise((resolve, reject) => {
			restartChild.on("close", code => {
				if (code === 0) {
					resolve(void 0);
				} else {
					reject(new Error(`Failed to restart Mosquitto service: ${code}`));
				}
			});
		});
	}

	async fetchData(apiKey: string) {
		try {
			const response = await fetch(this.url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": apiKey
				}
			});
			const rawData = await response.json();
			const data: SubscriptionData = rawData as SubscriptionData;
			await this.createFileIfNotExists();
			await Promise.all(
				data.data.map(async ({ user_id, api_key }) => {
					await this.updateMosquittoPassword(user_id, api_key);
				})
			);
			await this.restartMosquittoService();
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}
}

export default MosquittoService;
