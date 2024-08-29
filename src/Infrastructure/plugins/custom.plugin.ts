import Hapi from "@hapi/hapi";

import admins from "../../Interface/api/admins";

const CustomPlugin = async (server: Hapi.Server) => {
	await server.register([
		{
			plugin: admins,
			routes: {
				prefix: "/api/v1"
			}
		}
	]);
};

export default CustomPlugin;