import type { Server } from "@hapi/hapi";
import routes from "./routes";
import StorageHandler from "./handler";
import config from "../../../Infrastructure/settings/config";
import StorageService from "../../../App/services/server/storage.service";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import StorageRepository from "../../../Infrastructure/repositories/server/storage/storage.repo";
import AdminRepository from "../../../Infrastructure/repositories/server/postgres/admin.repo";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";
import RedisRepository from "../../../Infrastructure/repositories/server/cache/redis.repo";

const storageRepository = new StorageRepository({
	projectId: config.storage.projectId as string,
	keyFilename: config.storage.keyFilename as string,
	bucketName: config.storage.bucketName as string
});
const userRepository = new UserRepository(config.photo.default as string);
const adminRepository = new AdminRepository(config.photo.default as string);
const redisRepository = new RedisRepository();
const authRepository = new AuthRepository();
const storageService = new StorageService(
	storageRepository,
	adminRepository,
	userRepository,
	authRepository,
	redisRepository
);
const storageHandler = new StorageHandler(storageService);

export default {
	name: "storages",
	version: "1.0.0",
	register: async (server: Server) => {
		server.route(routes(storageHandler));
	}
};
