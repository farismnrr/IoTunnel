import Config from "../../settings/config";

class MosquittoRepository {
    async getMosquittoUrl(): Promise<void> {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
				"x-api-key": Config.mosquitto.apiKey || ""
			}
		};
		await fetch(`${Config.mosquitto.url}/mosquitto`, options);
	}
}

export default MosquittoRepository;