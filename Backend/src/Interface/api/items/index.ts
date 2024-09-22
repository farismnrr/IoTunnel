import type { Server } from "@hapi/hapi";
import routes from "./routes";
import ItemHandler from "./handler";
import ItemService from "../../../App/services/mqtt/item.service";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import ItemRepository from "../../../Infrastructure/repositories/server/mqtt/item.repo";
import ItemValidator from "../../../App/validators/items";
import config from "../../../Infrastructure/settings/config";

const itemRepository = new ItemRepository();
const authRepository = new AuthRepository();
const itemService = new ItemService(itemRepository, authRepository, config.jwt.serverKey as string);
const itemHandler = new ItemHandler(itemService, ItemValidator);

export default {
    name: "items",
    version: "1.0.0",
    description: "Add Item API",
    register: (server: Server) => {
        server.route(routes(itemHandler));
    }
};
