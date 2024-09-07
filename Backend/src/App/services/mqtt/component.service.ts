import type { IComponentPayload } from "../../../Common/models/types";
import ComponentRepository from "../../../Infrastructure/repositories/mqtt/component.repo";
import SubscriptionRepository from "../../../Infrastructure/repositories/server/subscription.repo";
import TopicRepository from "../../../Infrastructure/repositories/mqtt/topic.repo";
import ItemRepository from "../../../Infrastructure/repositories/mqtt/item.repo";
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

	constructor(
		componentRepository: ComponentRepository,
		subscriptionRepository: SubscriptionRepository,
		topicRepository: TopicRepository,
		itemRepository: ItemRepository
	) {
		this._componentRepository = componentRepository;
		this._subscriptionRepository = subscriptionRepository;
		this._topicRepository = topicRepository;
		this._itemRepository = itemRepository;
	}

	async createComponent(component: IComponentPayload, apiKey: string): Promise<string> {
		if (!apiKey) {
			throw new AuthenticationError("Api Key is required");
		}
		apiKey = apiKey.split(" ")[1];
		const id = `component-${nanoid(16)}`;
		const item = await this._itemRepository.getItemByName(component.item_name);
		if (!item) {
			throw new NotFoundError("Item not found");
		}
		const subscription = await this._subscriptionRepository.getSubscriptionByApiKey(apiKey);
		if (!subscription) {
			throw new NotFoundError("Subscription not found");
		}
		const isItemExists = await this._componentRepository.checkComponentItem(
			item.id,
			subscription.user_id
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
			user_id: subscription.user_id as string
		});
		return id;
	}

	async getComponentByUserId(itemName: string, apiKey: string): Promise<string> {
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
		const components = await this._componentRepository.getComponentByItemId(item.id);
		if (!components || components.length === 0) {
			throw new NotFoundError("Component not found");
		}
		const topicId =
			components.find(component => component.user_id === subscription.user_id)?.topic_id ||
			"";
		if (!topicId) {
			throw new NotFoundError("Topic not found");
		}
		return topicId;
	}

	async updateComponent(id: string, payload: IComponentPayload, apiKey: string): Promise<void> {
		if (!apiKey) {
			throw new AuthenticationError("Api Key is required");
		}
		apiKey = apiKey.split(" ")[1];
		const item = await this._itemRepository.getItemByName(payload.item_name);
		if (!item) {
			throw new NotFoundError("Item not found");
		}
		const subscription = await this._subscriptionRepository.getSubscriptionByApiKey(apiKey);
		if (!subscription) {
			throw new NotFoundError("Subscription not found");
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

	async deleteComponent(id: string, apiKey: string): Promise<void> {
		if (!apiKey) {
			throw new AuthenticationError("Api Key is required");
		}
		apiKey = apiKey.split(" ")[1];
		const component = await this._componentRepository.getComponentById(id);
		if (!component) {
			throw new NotFoundError("Component not found");
		}
		const subscription = await this._subscriptionRepository.getSubscriptionByApiKey(apiKey);
		if (!subscription) {
			throw new NotFoundError("Subscription not found");
		}
		if (component.user_id !== subscription.user_id) {
			throw new AuthorizationError("You are not allowed to delete this component");
		}
		await this._componentRepository.deleteComponent(id);
	}
}

export default ComponentService;
