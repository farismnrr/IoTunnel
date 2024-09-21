import Hapi from "@hapi/hapi";
import admins from "../../Interface/api/admins";
import users from "../../Interface/api/users";
import products from "../../Interface/api/products";
import orders from "../../Interface/api/orders";
import items from "../../Interface/api/items";
import components from "../../Interface/api/components";
import storage from "../../Interface/api/storage";
import projects from "../../Interface/api/projects";

const CustomPlugin = async (server: Hapi.Server) => {
	await server.register([
		{
			plugin: admins,
			routes: {
				prefix: "/api/v1"
			}
		},
		{
			plugin: users,
			routes: {
				prefix: "/api/v1"
			}
		},
		{
			plugin: products,
			routes: {
				prefix: "/api/v1"
			}
		},
		{
			plugin: orders,
			routes: {
				prefix: "/api/v1"
			}
		},
		{
			plugin: items,
			routes: {
				prefix: "/api/v1"
			}
		},
		{
			plugin: storage,
			routes: {
				prefix: "/api/v1"
			}
		},
		{
			plugin: projects,
			routes: {
				prefix: "/api/v1"
			}
		},
		{
			plugin: components,
			routes: {
				prefix: "/api/v1"
			}
		}
	]);
};

export default CustomPlugin;
