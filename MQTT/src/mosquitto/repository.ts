import type { WebhookResponse } from "../utils/models";
import util from "util";
import config from "../utils/config";
import { exec } from "child_process";
const execPromise = util.promisify(exec);

class MosquittoRepository {
    async getServerConnection(): Promise<number | undefined> {
        try {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
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
                Authorization: apiKey
            }
        };
        const response = await fetch(
            `${config.mosquitto.apiUrl}/api/v1/orders/subscription`,
            options
        );
        if (response.status !== 200) {
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

    async updateMosquittoPassword(data: WebhookResponse): Promise<void> {
        const command = `sudo mosquitto_passwd -b /etc/mosquitto/passwd ${data.user_id} ${data.api_key}`;
        exec(command, (error: Error | null) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                return;
            }
        });
        const { stdout, stderr } = await execPromise(`pidof mosquitto`);
        const pid = stdout.trim();
        if (!pid) {
            return;
        }
        await execPromise(`sudo kill -HUP ${pid}`).catch((error: Error | null) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                return;
            }
        });
    }

    async deleteMosquittoPassword(userId: string): Promise<void> {
        const command = `sudo mosquitto_passwd -D /etc/mosquitto/passwd ${userId}`;
        exec(command, (error: Error | null) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                return;
            }
        });

        const { stdout, stderr } = await execPromise(`pidof mosquitto`);
        const pid = stdout.trim();
        if (!pid) {
            return;
        }
        await execPromise(`sudo kill -HUP ${pid}`).catch((error: Error | null) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                return;
            }
        });
    }
}

export default MosquittoRepository;
