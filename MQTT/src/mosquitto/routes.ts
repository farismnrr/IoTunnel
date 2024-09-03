import type { ServerRoute } from "@hapi/hapi";
import MosquittoHandler from "./handler";

const routes: (handler: MosquittoHandler) => ServerRoute[] = handler => [
	{
		method: "POST",
		path: "/mosquitto/password",
		handler: handler.postPassword,
	},
];

export default routes;