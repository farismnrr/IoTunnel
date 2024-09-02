import Hapi from "@hapi/hapi";
import admins from "../../Interface/api/admins";
import users from "../../Interface/api/users";
import products from "../../Interface/api/products";
import orders from "../../Interface/api/orders";

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
		}
	]);
};

export default CustomPlugin;