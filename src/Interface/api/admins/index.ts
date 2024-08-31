import type { Server } from "@hapi/hapi";
import routes from "./routes";
import AdminHandler from "./handler";
import AdminService from "../../../App/services/admin.service";
import AdminRepository from "../../../Infrastructure/repositories/admin.repo";
import AdminValidator from "../../../App/validators/admins";
import MailRepository from "../../../Infrastructure/repositories/mail.repo";
import AuthRepository from "../../../Infrastructure/repositories/auth.repo";
import TokenManager from "../../../Common/tokens/manager.token";

const adminRepository = new AdminRepository();
const mailRepository = new MailRepository();
const authRepository = new AuthRepository();

const adminService = new AdminService(adminRepository, mailRepository, authRepository);
const adminHandler = new AdminHandler(adminService, AdminValidator, TokenManager);

export default {
	name: "admins",
    version: "1.0.0",
	description: "Add Admin API",
	register: (server: Server) => {
		server.route(routes(adminHandler));
	}
};