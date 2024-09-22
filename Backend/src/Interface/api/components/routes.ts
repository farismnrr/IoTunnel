import type { ServerRoute } from "@hapi/hapi";
import ItemHandler from "./handler";

const routes: (handler: ItemHandler) => ServerRoute[] = handler => [
    // Start Item Routes
    {
        method: "POST",
        path: "/components",
        handler: handler.createComponentHandler,
        options: {
            auth: "user_jwt"
        }
    },
    {
        method: "GET",
        path: "/components/{projectId}",
        handler: handler.getComponentByProjectIdHandler,
        options: {
            auth: "user_jwt"
        }
    },
    {
        method: "GET",
        path: "/components/{projectId}/{itemName}",
        handler: handler.getComponentByApiKeyHandler
    },
    {
        method: "PATCH",
        path: "/components/{componentId}",
        handler: handler.updateComponentHandler,
        options: {
            auth: "user_jwt"
        }
    },
    {
        method: "DELETE",
        path: "/components/{componentId}",
        handler: handler.deleteComponentHandler,
        options: {
            auth: "user_jwt"
        }
    }
    // End Item Routes
];

export default routes;
