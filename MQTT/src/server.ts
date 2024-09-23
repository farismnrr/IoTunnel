import Hapi from "@hapi/hapi";
import MosquittoRepository from "./mosquitto/repository";
import MosquittoService from "./mosquitto/service";
import MosquittoHandler from "./mosquitto/handler";
import ComponentsRepository from "./components/repository";
import ComponentsService from "./components/service";
import ComponentsHandler from "./components/handler";
import mosquittoRoutes from "./mosquitto/routes";
import componentsRoutes from "./components/routes";
import config from "./utils/config";

const createServer = async () => {
    const server = Hapi.server({
        port: config.server.port,
        host: config.server.host,
        routes: {
            cors: {
                origin: ["*"],
            },
        },
    });

    server.route({
        method: "GET",
        path: "/",
        handler: function (request: Hapi.Request, h: Hapi.ResponseToolkit) {
            return h.response("Server Connected");
        },
    });

    return server;
};

const mosquittoPlugin = {
    plugin: {
        register: async (server: Hapi.Server) => {
            const repository = new MosquittoRepository();
            const service = new MosquittoService(repository);
            const handler = new MosquittoHandler(service);
            server.route(mosquittoRoutes(handler));
        },
        name: "mosquittoPlugin",
        version: "1.0.0",
    },
};

const componentsPlugin = {
    plugin: {
        register: async (server: Hapi.Server) => {
            const repository = new ComponentsRepository();
            const service = new ComponentsService(repository);
            const handler = new ComponentsHandler(service);
            server.route(componentsRoutes(handler));
        },
        name: "componentsPlugin",
        version: "1.0.0",
    },
};

const handleClientError = (server: Hapi.Server) => {
    server.ext("onPreResponse", (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
        const { response } = request;
        if (response instanceof Error) {
            const newResponse = h.response({
                status: "fail",
                message: response.message,
            });
            newResponse.code(500);
            return newResponse;
        }
        return h.continue;
    });
};

const init = async () => {
    const server = await createServer();
    await mosquittoPlugin.plugin.register(server);
    await componentsPlugin.plugin.register(server);
    await handleClientError(server);
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

init();
