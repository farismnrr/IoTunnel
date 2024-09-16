import type { Server } from "@hapi/hapi";
import routes from "./routes";
import StorageHandler from "./handler";
import config from "../../../Infrastructure/settings/config";
import StorageValidator from "../../../App/validators/storage";
import StorageService from "../../../App/services/server/storage.service";
import StorageRepository from "../../../Infrastructure/repositories/server/storage/storage.repo";
import AdminRepository from "../../../Infrastructure/repositories/server/postgres/admin.repo";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";

const storageRepository = new StorageRepository({
	projectId: config.storage.projectId as string,
	keyFilename: config.storage.keyFilename as string,
	bucketName: config.storage.bucketName as string
});

const userRepository = new UserRepository(config.photo.default as string);
const adminRepository = new AdminRepository(config.photo.default as string);
const storageService = new StorageService(storageRepository, adminRepository, userRepository);
const storageHandler = new StorageHandler(storageService, StorageValidator);

export default {
	name: "storages",
	version: "1.0.0",
	register: async (server: Server) => {
		server.route(routes(storageHandler));
	}
};
