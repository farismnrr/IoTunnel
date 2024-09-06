import Config from "../../settings/config";
import ConnectionError from "../../../Common/errors";

class MosquittoRepository {
	async getMosquittoConnection(): Promise<void> {
		try {
			const options = {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			};
			await fetch(`${Config.mosquitto.url}`, options);
		} catch (error) {
			console.error("Failed to get Mosquitto Connection:", error);
		}
	}

	async getMosquittoUrl(api_key: string): Promise<void> {
		try {
			const options = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: api_key
				}
			};
			const response = await fetch(`${Config.mosquitto.url}/mosquitto/password`, options);
			if (response.status !== 201) {
				throw new ConnectionError("Failed to get Mosquitto URL");
			}
			await response.json();
		} catch (error) {
			console.error("Failed to get Mosquitto URL:", error);
			throw error;
		}
	}

	async deleteMosquittoUrl(api_key: string, user_id: string): Promise<void> {
		try {
			const options = {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: api_key
				}
			};
			const response = await fetch(
				`${Config.mosquitto.url}/mosquitto/password/${user_id}`,
				options
			);
			if (response.status !== 200) {
				throw new ConnectionError("Failed to delete Mosquitto URL");
			}
			await response.json();
		} catch (error) {
			console.error("Failed to delete Mosquitto URL:", error);
			throw error;
		}
	}
}

export default MosquittoRepository;
