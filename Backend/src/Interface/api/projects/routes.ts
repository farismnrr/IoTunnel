import type { ServerRoute } from "@hapi/hapi";
import ProjectHandler from "./handler";

const routes: (handler: ProjectHandler) => ServerRoute[] = handler => [
	{
		method: "POST",
		path: "/projects",
		handler: handler.addProjectHandler,
		options: {
			auth: "users_jwt"
		}
	},
	{
		method: "GET",
		path: "/projects",
		handler: handler.getAllProjectHandler,
		options: {
			auth: "users_jwt"
		}
	},
	{
		method: "PUT",
		path: "/projects/{projectId}",
		handler: handler.updateProjectHandler,
		options: {
			auth: "users_jwt"
		}
	},
	{
		method: "DELETE",
		path: "/projects/{projectId}",
		handler: handler.deleteProjectHandler,
		options: {
			auth: "users_jwt"
		}
	}
];

export default routes;
