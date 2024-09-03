import Hapi from "@hapi/hapi";
import config from "./Infrastructure/settings/config";
import MigrationsPlugin from "./Infrastructure/plugins/migration.plugin";
import ExternalPlugins from "./Infrastructure/plugins/external.plugin";
import ExpirityPlugin from "./Infrastructure/plugins/expirity.plugin";
import CustomPlugins from "./Infrastructure/plugins/custom.plugin";
import LogPlugin from "./Infrastructure/plugins/logging.plugin";
import ClientError from "./Common/errors";

const createServer = async () => {
	const server = new Hapi.Server({
		port: config.server.port,
		host: config.server.host,
		routes: {
			cors: {
				origin: ["*"],
				credentials: true
			}
		}
	});

	await server.route({
		method: "GET",
		path: "/",
		handler: function (request: Hapi.Request, h: Hapi.ResponseToolkit) {
			return h.response("Server Connected");
		}
	});

	return server;
};

const handleClientError = (server: Hapi.Server) => {
	server.ext("onPreResponse", (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
		const { response } = request;
		if (response instanceof Error) {
			const newResponse = h.response({
				status: "fail",
				message: response.message
			});
			if (response instanceof ClientError) {
				newResponse.code(response.statusCode);
			} else if (response instanceof Error) {
				if (response.message === 'invalid input syntax for type uuid: "xxx"') {
					newResponse.code(400);
				} else {
					newResponse.code(401);
				}
			} else {
				newResponse.code(500);
			}
			return newResponse;
		}
		return h.continue;
	});
};

const handleServerLog = (server: Hapi.Server) => {
	if (process.env.NODE_ENV !== "production") {
		server.ext("onRequest", (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
			LogPlugin.ServerRequestLog(request);
			return h.continue;
		});

		server.ext("onPreResponse", (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
			LogPlugin.ServerResponseLog(request, h);
			return h.continue;
		});
	}
};

const startServer = async () => {
	const server = await createServer();
	await MigrationsPlugin(server);
	await ExternalPlugins(server);
	await ExpirityPlugin(server);
	await CustomPlugins(server);
	handleClientError(server);
	handleServerLog(server);

	await server.start();
	console.log(`Server running at ${server.info.uri}`);
};

startServer();
