import type { ServerRoute } from "@hapi/hapi";
import ProjectHandler from "./handler";

const routes: (handler: ProjectHandler) => ServerRoute[] = handler => [
	{
		method: "POST",
		path: "/projects",
		handler: handler.addProjectHandler,
		options: {
			auth: "user_jwt"
		}
	},
	{
		method: "GET",
		path: "/projects",
		handler: handler.getAllProjectHandler,
		options: {
			auth: "user_jwt"
		}
	},
	{
		method: "PUT",
		path: "/projects/{projectId}",
		handler: handler.updateProjectHandler,
		options: {
			auth: "user_jwt"
		}
	},
	{
		method: "DELETE",
		path: "/projects/{projectId}",
		handler: handler.deleteProjectHandler,
		options: {
			auth: "user_jwt"
		}
	}
];

export default routes;
