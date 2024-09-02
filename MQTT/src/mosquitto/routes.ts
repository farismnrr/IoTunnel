import type { ServerRoute } from "@hapi/hapi";
import MosquittoHandler from "./handler";

const routes: (handler: MosquittoHandler) => ServerRoute[] = (handler) => [
	{
		method: "GET",
		path: "/mosquitto",
		handler: handler.handle,
	},
];

export default routes;