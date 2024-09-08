import config from "../utils/config";

class ComponentsRepository {
	async getUserTopicsByComponent(apiKey: string, componentName: string): Promise<string> {
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: apiKey,
			},
		};
		const response = await fetch(`${config.mosquitto.apiUrl}/api/v1/components/${componentName}`, options);
		if (response.status !== 200) {
			console.log(response);
			console.log("Failed to fetch user topics by component");
			throw new Error("Failed to fetch user topics by component");
		}
		const data = await response.json();
		return data.data.topic_id;
	}
}

export default ComponentsRepository;