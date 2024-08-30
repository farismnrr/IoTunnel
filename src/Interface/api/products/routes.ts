import type { ServerRoute } from "@hapi/hapi";
import ProductHandler from "./handler";

const routes: (handler: ProductHandler) => ServerRoute[] = handler => [
    // Start Product Routes
	{
		method: "GET",
		path: "/products",
		handler: handler.getProductsHandler
	},
    {
        method: "GET",
        path: "/products/{id}",
        handler: handler.getProductByIdHandler
    },
	// End Product Routes

    // Start Product Auth Routes
    {
        method: "POST",
        path: "/products",
        handler: handler.postProductHandler,
        options: {
            auth: "admin_jwt"
        }
    },
    {
        method: "PUT",
        path: "/products/{id}",
        handler: handler.putProductByIdHandler,
        options: {
            auth: "admin_jwt"
        }
    },
    {
        method: "DELETE",
        path: "/products/{id}",
        handler: handler.deleteProductByIdHandler,
        options: {
            auth: "admin_jwt"
        }
    },
    // End Product Auth Routes

    // Start Trial Routes
    {
        method: "GET",
        path: "/trials/{id}",
        handler: handler.getTrialByUserIdHandler,
        options: {
            auth: "user_jwt"
        }
    },
    {
        method: "PUT", 
        path: "/trials/{id}",
        handler: handler.editTrialByUserIdHandler,
        options: {
            auth: "user_jwt"
        }
    },
    // End Trial Routes
];

export default routes;