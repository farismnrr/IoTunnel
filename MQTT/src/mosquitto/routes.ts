import type { ServerRoute } from "@hapi/hapi";
import MosquittoHandler from "./handler";

const routes: (handler: MosquittoHandler) => ServerRoute[] = handler => [
	{
		method: "POST",
		path: "/mosquitto/password",
		handler: handler.postPassword,
	},
	{
		method: "DELETE",
		path: "/mosquitto/password",
		handler: handler.deletePassword,
	},
];

export default routes;