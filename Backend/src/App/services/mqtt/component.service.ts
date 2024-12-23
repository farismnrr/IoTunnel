import type { IComponentPayload, IComponent } from "../../../Common/models/types";
import ComponentRepository from "../../../Infrastructure/repositories/server/mqtt/component.repo";
import SubscriptionRepository from "../../../Infrastructure/repositories/server/postgres/subscription.repo";
import TopicRepository from "../../../Infrastructure/repositories/server/mqtt/topic.repo";
import ItemRepository from "../../../Infrastructure/repositories/server/mqtt/item.repo";
import ProjectRepository from "../../../Infrastructure/repositories/server/mqtt/project.repo";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";
import RedisRepository from "../../../Infrastructure/repositories/server/cache/redis.repo";
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
    private readonly _redisRepository: RedisRepository;

    constructor(
        componentRepository: ComponentRepository,
        subscriptionRepository: SubscriptionRepository,
        topicRepository: TopicRepository,
        itemRepository: ItemRepository,
        projectRepository: ProjectRepository,
        userRepository: UserRepository,
        redisRepository: RedisRepository
    ) {
        this._componentRepository = componentRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._topicRepository = topicRepository;
        this._itemRepository = itemRepository;
        this._projectRepository = projectRepository;
        this._userRepository = userRepository;
        this._redisRepository = redisRepository;
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
        await this._topicRepository.addTopic(topicId);
        await this._componentRepository.addComponent({
            id,
            name: component.name,
            item_id: item.id,
            topic_id: topicId,
            user_id: user.id,
            project_id: project.id
        });
        await this._redisRepository.delete(`component:${project.id}-${item.name}`);
        return id;
    }

    async getComponentByApiKey(
        apiKey: string,
        projectId: string,
        itemName: string
    ): Promise<{ topic_id: string; source: string }> {
        if (!apiKey) {
            throw new AuthenticationError("Api Key is required");
        }
        const componentCache = await this._redisRepository.get(
            `component:${projectId}-${itemName}`
        );
        const item = await this._itemRepository.getItemByName(itemName);
        if (!item) {
            throw new NotFoundError("Pin not Used");
        }
        const project = await this._projectRepository.getProjectById(projectId);
        if (!project) {
            throw new NotFoundError("Project not found");
        }
        const subscription = await this._subscriptionRepository.getSubscriptionByApiKey(apiKey);
        if (!subscription) {
            throw new NotFoundError("Subscription not found");
        }
        const components = await this._componentRepository.getComponentByItemId(item.id);
        if (!components || components.length === 0) {
            throw new NotFoundError("Component not found");
        }
        if (componentCache) {
            return {
                topic_id: JSON.parse(componentCache),
                source: "cache"
            };
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
        await this._redisRepository.set(`component:${projectId}-${itemName}`, topicId);
        return {
            topic_id: topicId,
            source: "database"
        };
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
        await this._redisRepository.delete(`component:${project.id}-${item.name}`);
        await this._componentRepository.updateComponent(id, payload.name, item.id);
    }

    async deleteComponent(id: string, userId: string, payload: IComponentPayload): Promise<void> {
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
        await this._redisRepository.delete(`component:${payload.project_id}-${payload.item_name}`);
        await this._topicRepository.deleteTopicById(component.topic_id);
        await this._componentRepository.deleteComponent(id);
    }
}

export default ComponentService;
