import type { Server } from "@hapi/hapi";
import routes from "./routes";
import ComponentHandler from "./handler";
import config from "../../../Infrastructure/settings/config";
import ComponentValidator from "../../../App/validators/components";
import ComponentService from "../../../App/services/mqtt/component.service";
import ItemRepository from "../../../Infrastructure/repositories/server/mqtt/item.repo";
import TopicRepository from "../../../Infrastructure/repositories/server/mqtt/topic.repo";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";
import ProjectRepository from "../../../Infrastructure/repositories/server/mqtt/project.repo";
import ComponentRepository from "../../../Infrastructure/repositories/server/mqtt/component.repo";
import SubscriptionRepository from "../../../Infrastructure/repositories/server/postgres/subscription.repo";
import RedisRepository from "../../../Infrastructure/repositories/server/cache/redis.repo";

const componentRepository = new ComponentRepository();
const subscriptionRepository = new SubscriptionRepository();
const topicRepository = new TopicRepository();
const itemRepository = new ItemRepository();
const projectRepository = new ProjectRepository();
const redisRepository = new RedisRepository();
const userRepository = new UserRepository(config.photo.default as string);
const componentService = new ComponentService(
	componentRepository,
	subscriptionRepository,
	topicRepository,
	itemRepository,
	projectRepository,
	userRepository,
	redisRepository
);
const componentHandler = new ComponentHandler(componentService, ComponentValidator);

export default {
	name: "components",
	version: "1.0.1",
	description: "Change Component Authorization from Api Key to JWT",
	register: (server: Server) => {
		server.route(routes(componentHandler));
	}
};
