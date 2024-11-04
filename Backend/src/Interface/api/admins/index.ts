import type { Server } from "@hapi/hapi";
import routes from "./routes";
import AdminHandler from "./handler";
import AdminValidator from "../../../App/validators/admins";
import config from "../../../Infrastructure/settings/config";
import TokenManager from "../../../Common/manager/manager.token";
import AdminService from "../../../App/services/server/admin.service";
import AdminRepository from "../../../Infrastructure/repositories/server/postgres/admin.repo";
import MailRepository from "../../../Infrastructure/repositories/server/mail/mail.repo";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import RedisRepository from "../../../Infrastructure/repositories/server/cache/redis.repo";
import ResponseManager from "../../../Common/manager/manager.response";

const mailRepository = new MailRepository();
const authRepository = new AuthRepository(config.timeOut.otp as number);
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
    ResponseManager,
    config.jwt.adminKey as string,
    config.requestEnv
);

export default {
    name: "admins",
    version: "1.0.2",
    description: "Add Admin Photo",
    register: (server: Server) => {
        server.route(routes(adminHandler));
    }
};
