import type { Server } from "@hapi/hapi";
import routes from "./routes";
import ProjectHandler from "./handler";
import ProjectService from "../../../App/services/mqtt/project.service";
import ProjectRepository from "../../../Infrastructure/repositories/server/mqtt/project.repo";
import SubscriptionRepository from "../../../Infrastructure/repositories/server/postgres/subscription.repo";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";
import ProjectValidator from "../../../App/validators/projects";
import config from "../../../Infrastructure/settings/config";

const projectRepository = new ProjectRepository();
const subscriptionRepository = new SubscriptionRepository();
const authRepository = new AuthRepository();
const userRepository = new UserRepository(config.photo.default as string);
const projectService = new ProjectService(projectRepository, authRepository, userRepository, subscriptionRepository);
const projectHandler = new ProjectHandler(projectService, ProjectValidator);

export default {
	name: "projects",
	description: "API for managing projects",
	version: "1.0.0",
	register: async (server: Server) => {
		server.route(routes(projectHandler));
	}
};
