import type { Server } from "@hapi/hapi";
import routes from "./routes";
import AdminHandler from "./handler";
import AdminValidator from "../../../App/validators/admins";
import config from "../../../Infrastructure/settings/config";
import TokenManager from "../../../Common/tokens/manager.token";
import AdminService from "../../../App/services/server/admin.service";
import AdminRepository from "../../../Infrastructure/repositories/server/postgres/admin.repo";
import MailRepository from "../../../Infrastructure/repositories/server/mail/mail.repo";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import RedisRepository from "../../../Infrastructure/repositories/server/cache/redis.repo";

const mailRepository = new MailRepository();
const authRepository = new AuthRepository();
const redisRepository = new RedisRepository();
const adminRepository = new AdminRepository(config.photo.default as string);

const adminService = new AdminService(
    adminRepository,
    mailRepository,
    authRepository,
    redisRepository,
    config.jwt.serverKey as string,
    config.jwt.adminKey as string
);
const adminHandler = new AdminHandler(
    adminService,
    AdminValidator,
    TokenManager,
    config.jwt.adminKey as string
);

export default {
    name: "admins",
    version: "1.0.2",
    description: "Add Admin Photo",
    register: (server: Server) => {
        server.route(routes(adminHandler));
    }
};
