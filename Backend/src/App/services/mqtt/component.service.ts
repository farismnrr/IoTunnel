import type { IComponentPayload, IComponent } from "../../../Common/models/types";
import ComponentRepository from "../../../Infrastructure/repositories/server/mqtt/component.repo";
import SubscriptionRepository from "../../../Infrastructure/repositories/server/postgres/subscription.repo";
import TopicRepository from "../../../Infrastructure/repositories/server/mqtt/topic.repo";
import ItemRepository from "../../../Infrastructure/repositories/server/mqtt/item.repo";
import ProjectRepository from "../../../Infrastructure/repositories/server/mqtt/project.repo";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";
import { nanoid } from "nanoid";
import {
	NotFoundError,
	InvariantError,
	AuthenticationError,
	AuthorizationError
} from "../../../Common/errors";

class ComponentService {
	private readonly _componentRepository: ComponentRepository;
	private readonly _subscriptionRepository: SubscriptionRepository;
	private readonly _topicRepository: TopicRepository;
	private readonly _itemRepository: ItemRepository;
	private readonly _projectRepository: ProjectRepository;
	private readonly _userRepository: UserRepository;

	constructor(
		componentRepository: ComponentRepository,
		subscriptionRepository: SubscriptionRepository,
		topicRepository: TopicRepository,
		itemRepository: ItemRepository,
		projectRepository: ProjectRepository,
		userRepository: UserRepository
	) {
		this._componentRepository = componentRepository;
		this._subscriptionRepository = subscriptionRepository;
		this._topicRepository = topicRepository;
		this._itemRepository = itemRepository;
		this._projectRepository = projectRepository;
		this._userRepository = userRepository;
	}

	async createComponent(userId: string, component: IComponentPayload): Promise<string> {
		const user = await this._userRepository.getUserById(userId);
		if (!user) {
			throw new NotFoundError("User not found");
		}
		const id = `component-${nanoid(16)}`;
		const item = await this._itemRepository.getItemByName(component.item_name);
		if (!item) {
			throw new NotFoundError("Item not found");
		}
		const subscription = await this._subscriptionRepository.getSubscriptionByUserId(userId);
		if (!subscription) {
			throw new NotFoundError("Subscription not found");
		}
		const project = await this._projectRepository.getProjectById(component.project_id);
		if (!project) {
			throw new NotFoundError("Project not found");
		}
		const isItemExists = await this._componentRepository.checkComponentItem(
			item.id,
			subscription.user_id,
			project.id
		);
		if (isItemExists) {
			throw new InvariantError("Pin already Used");
		}
		const topicId = `topic-${nanoid(16)}`;
		await this._topicRepository.addTopic({
			id: topicId,
			subscription_id: subscription.id as string
		});
		await this._componentRepository.addComponent({
			id,
			name: component.name,
			item_id: item.id,
			topic_id: topicId as string,
			user_id: subscription.user_id as string,
			project_id: project.id as string
		});
		return id;
	}

	async getComponentByApiKey(
		apiKey: string,
		projectId: string,
		itemName: string
	): Promise<string> {
		if (!apiKey) {
			throw new AuthenticationError("Api Key is required");
		}
		apiKey = apiKey.split(" ")[1];
		const item = await this._itemRepository.getItemByName(itemName);
		if (!item) {
			throw new NotFoundError("Pin not Used");
		}
		const subscription = await this._subscriptionRepository.getSubscriptionByApiKey(apiKey);
		if (!subscription) {
			throw new NotFoundError("Subscription not found");
		}
		const project = await this._projectRepository.getProjectById(projectId);
		if (!project) {
			throw new NotFoundError("Project not found");
		}
		const components = await this._componentRepository.getComponentByItemId(item.id);
		if (!components || components.length === 0) {
			throw new NotFoundError("Component not found");
		}
		const topicId =
			components.find(
				component =>
					component.user_id === subscription.user_id &&
					component.project_id === project.id
			)?.topic_id || "";
		if (!topicId) {
			throw new NotFoundError("Topic not found");
		}
		return topicId;
	}

	async getComponentByProjectId(userId: string, projectId: string): Promise<IComponent[]> {
		const user = await this._userRepository.getUserById(userId);
		if (!user) {
			throw new NotFoundError("User not found");
		}
		const subscription = await this._subscriptionRepository.getSubscriptionByUserId(userId);
		if (!subscription) {
			throw new NotFoundError("Subscription not found");
		}
		const project = await this._projectRepository.getProjectById(projectId);
		if (!project) {
			throw new NotFoundError("Project not found");
		}
		const components = await this._componentRepository.getComponentByProjectId(projectId);
		if (!components || components.length === 0) {
			throw new NotFoundError("Component not found");
		}
		return components;
	}

	async updateComponent(id: string, userId: string, payload: IComponentPayload): Promise<void> {
		const user = await this._userRepository.getUserById(userId);
		if (!user) {
			throw new NotFoundError("User not found");
		}
		if (!payload) {
			throw new InvariantError("Payload is required");
		}
		const subscription = await this._subscriptionRepository.getSubscriptionByUserId(userId);
		if (!subscription) {
			throw new NotFoundError("Subscription not found");
		}
		const project = await this._projectRepository.getProjectById(payload.project_id);
		if (!project) {
			throw new NotFoundError("Project not found");
		}
		const item = await this._itemRepository.getItemByName(payload.item_name);
		if (!item) {
			throw new NotFoundError("Item not found");
		}
		const component = await this._componentRepository.getComponentById(id);
		if (!component) {
			throw new NotFoundError("Component not found");
		}
		if (component.user_id !== subscription.user_id) {
			throw new AuthorizationError("You are not allowed to update this component");
		}
		await this._componentRepository.updateComponent(id, payload.name, item.id);
	}

	async deleteComponent(id: string, userId: string): Promise<void> {
		const user = await this._userRepository.getUserById(userId);
		if (!user) {
			throw new NotFoundError("User not found");
		}
		const subscription = await this._subscriptionRepository.getSubscriptionByUserId(userId);
		if (!subscription) {
			throw new NotFoundError("Subscription not found");
		}
		const component = await this._componentRepository.getComponentById(id);
		if (!component) {
			throw new NotFoundError("Component not found");
		}
		if (component.user_id !== subscription.user_id) {
			throw new AuthorizationError("You are not allowed to delete this component");
		}
		await this._componentRepository.deleteComponent(id);
	}
}

export default ComponentService;
