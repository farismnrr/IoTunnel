import type { ServerRoute } from "@hapi/hapi";
import ItemHandler from "./handler";

const routes: (handler: ItemHandler) => ServerRoute[] = handler => [
    // Start Item Routes
    {
        method: "GET",
        path: "/items",
        handler: handler.getItemsHandler
    },
    {
        method: "GET",
        path: "/items/{id}",
        handler: handler.getItemByIdHandler
    },
    // End Items Routes

    // Start Item Auth Routes
    {
        method: "POST",
        path: "/items",
        handler: handler.createItemHandler,
        options: {
            auth: "admin_jwt"
        }
    },
    {
        method: "PUT",
        path: "/items/{id}",
        handler: handler.updateItemHandler,
        options: {
            auth: "admin_jwt"
        }
    },
    {
        method: "DELETE",
        path: "/items/{id}",
        handler: handler.deleteItemHandler,
        options: {
            auth: "admin_jwt"
        }
    }
    // End Item Auth Routes
];

export default routes;
