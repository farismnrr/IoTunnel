import type { ServerRoute } from "@hapi/hapi";
import ItemHandler from "./handler";

const routes: (handler: ItemHandler) => ServerRoute[] = handler => [
	// Start Item Routes
	{
		method: "POST",
		path: "/components",
		handler: handler.createComponentHandler
	},
	{
		method: "GET",
		path: "/components/{itemName}",
		handler: handler.getComponentByProjectIdHandler
	},
	{
		method: "GET",
		path: "/components/{projectName}/{itemName}",
		handler: handler.getComponentByProjectIdHandler
	},
	{
		method: "PATCH",
		path: "/components/{id}",
		handler: handler.updateComponentHandler
	},
	{
		method: "DELETE",
		path: "/components/{id}",
		handler: handler.deleteComponentHandler
	}
	// End Item Routes
];

export default routes;
