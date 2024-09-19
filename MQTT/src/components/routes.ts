import type { ServerRoute } from "@hapi/hapi";
import ComponentsHandler from "./handler";

const componentsRoutes: (handler: ComponentsHandler) => ServerRoute[] = (handler) => [
	{
		method: "GET",
		path: "/components/{projectName}/{itemName}",
		handler: handler.getUserTopicsByComponent,
	},
];

export default componentsRoutes;
