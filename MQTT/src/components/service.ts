import ComponentsRepository from "./repository";

class ComponentsService {
	private readonly _componentsRepository: ComponentsRepository;

	constructor(componentsRepository: ComponentsRepository) {
		this._componentsRepository = componentsRepository;
	}

	async getUserTopicsByComponent(apiKey: string, componentName: string): Promise<string> {
		if (!apiKey) {
			throw new Error("API key is required");
		}
		const topics = await this._componentsRepository.getUserTopicsByComponent(apiKey, componentName);
		if (!topics) {
			throw new Error("Failed to get user topics by component");
		}
		return topics;
	}
}

export default ComponentsService;