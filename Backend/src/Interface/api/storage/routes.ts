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
                multipart: true,
                timeout: 10 * 1000,
                maxBytes: 100 * 1024 * 1024 // 100 MB
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
                multipart: true,
                timeout: 10 * 1000,
                maxBytes: 100 * 1024 * 1024 // 100 MB
            }
        }
    }
];

export default routes;
