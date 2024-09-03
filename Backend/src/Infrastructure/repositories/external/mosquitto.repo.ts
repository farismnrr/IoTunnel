import Config from "../../settings/config";

class MosquittoRepository {
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
				throw new Error("Failed to get Mosquitto URL");
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
			const response = await fetch(`${Config.mosquitto.url}/mosquitto/password/${user_id}`, options);
			if (response.status !== 200) {
				throw new Error("Failed to delete Mosquitto URL");
			}
			await response.json();
		} catch (error) {
			console.error("Failed to delete Mosquitto URL:", error);
			throw error;
		}
	}
}

export default MosquittoRepository;
