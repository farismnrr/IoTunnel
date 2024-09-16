import type { ServerRoute } from "@hapi/hapi";
import StorageHandler from "./handler";

const routes: (handler: StorageHandler) => ServerRoute[] = handler => [
	{
		method: "PATCH",
		path: "/storages/admin",
		handler: handler.uploadAdminFileHandler,
		config: {
			auth: "admin_jwt",
			payload: {
				multipart: true
			}
		}
	},
	{
		method: "PATCH",
		path: "/storages/user",
		handler: handler.uploadUserFileHandler,
		config: {
			auth: "user_jwt",
			payload: {
				multipart: true
			}
		}
	}
];

export default routes;
