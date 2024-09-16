import type { Server } from "@hapi/hapi";
import routes from "./routes";
import ComponentHandler from "./handler";
import ComponentService from "../../../App/services/mqtt/component.service";
import ComponentRepository from "../../../Infrastructure/repositories/server/mqtt/component.repo";
import SubscriptionRepository from "../../../Infrastructure/repositories/server/postgres/subscription.repo";
import TopicRepository from "../../../Infrastructure/repositories/server/mqtt/topic.repo";
import ItemRepository from "../../../Infrastructure/repositories/server/mqtt/item.repo";
import ComponentValidator from "../../../App/validators/components";

const componentRepository = new ComponentRepository();
const subscriptionRepository = new SubscriptionRepository();
const topicRepository = new TopicRepository();
const itemRepository = new ItemRepository();
const componentService = new ComponentService(
	componentRepository,
	subscriptionRepository,
	topicRepository,
	itemRepository
);
const componentHandler = new ComponentHandler(componentService, ComponentValidator);

export default {
	name: "components",
	version: "1.0.0",
	description: "Add Component API",
	register: (server: Server) => {
		server.route(routes(componentHandler));
	}
};
