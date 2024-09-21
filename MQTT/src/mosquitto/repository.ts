import config from "../utils/config";
import type { WebhookResponse } from "../utils/models";

class MosquittoRepository {
    async getServerConnection(): Promise<number | undefined> {
        try {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await fetch(`${config.mosquitto.apiUrl}`, options);
            return response.status;
        } catch (error) {
            console.error("Failed to get Server Connection:", error);
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

    async getMosquittoUser(): Promise<string[]> {
        const { execSync } = require("child_process");
        const output = execSync("cat /etc/mosquitto/passwd").toString();
        const users = output.split("\n").map((line: string) => line.split(":")[0]);
        return users;
    }
}

export default MosquittoRepository;
