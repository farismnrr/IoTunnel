import Config from "../../settings/config";

class MosquittoRepository {
	async getMosquittoUrl(api_key: string): Promise<void> {
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: api_key
			}
		};
		const response = await fetch(`${Config.mosquitto.url}/mosquitto/password`, options);
		await response.json();
	}
}

export default MosquittoRepository;
