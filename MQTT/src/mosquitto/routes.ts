import type { ServerRoute } from "@hapi/hapi";
import MosquittoHandler from "./handler";

const mosquittoRoutes: (handler: MosquittoHandler) => ServerRoute[] = (handler) => [
    {
        method: "GET",
        path: "/mosquitto/connection",
        handler: handler.getServerConnection,
    },
    {
        method: "GET",
        path: "/mosquitto/user",
        handler: handler.getMosquittoUser,
    },
    {
        method: "POST",
        path: "/mosquitto/password",
        handler: handler.postPassword,
    },
    {
        method: "DELETE",
        path: "/mosquitto/password/{userId}",
        handler: handler.deletePassword,
    },
];

export default mosquittoRoutes;
