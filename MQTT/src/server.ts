import { Server } from "@hapi/hapi";
import MosquittoHandler from "./mosquitto/handler";
import MosquittoService from "./mosquitto/service";
import routes from "./mosquitto/routes";

const init = async () => {
	const server = new Server({
		port: process.env.PORT,
		host: process.env.HOST
	});

	const mosquittoService = new MosquittoService();
	const mosquittoHandler = new MosquittoHandler(mosquittoService);
	server.route(routes(mosquittoHandler));

	await server.start();
	console.log("Server running on %s", server.info.uri);
};

init();
