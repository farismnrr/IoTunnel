import type { Request, ResponseToolkit } from "@hapi/hapi";
import type {
    IAdmin,
    IAdminWithOtp,
    IAdminWithNewPassword,
    IAuth
} from "../../../Common/models/types";
import autoBind from "auto-bind";
import AdminValidator from "../../../App/validators/admins";
import TokenManager from "../../../Common/tokens/manager.token";
import AdminService from "../../../App/services/server/admin.service";

class AdminHandler {
    private readonly _adminService: AdminService;
    private readonly _validator: typeof AdminValidator;
    private readonly _tokenManager: typeof TokenManager;
    private readonly _adminKey: string;

    constructor(
        adminService: AdminService,
        validator: typeof AdminValidator,
        tokenManager: typeof TokenManager,
        adminKey: string
    ) {
        this._adminService = adminService;
        this._validator = validator;
        this._tokenManager = tokenManager;
        this._adminKey = adminKey;
        autoBind(this);
    }

    // Start OTP Handler
    async sendOtpMailHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IAdmin;
        const serverAuth = request.headers.authorization;
        this._validator.validateSendOtpPayload(payload);
        const otpCode = await this._adminService.sendOtpMail(payload.email, serverAuth);
        return h
            .response({
                status: "success",
                message: "OTP sent to email",
                data: {
                    otp_code: otpCode
                }
            })
            .code(200);
    }

    async sendOtpResetPasswordHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IAdmin;
        const serverAuth = request.headers.authorization;
        this._validator.validateSendOtpPayload(payload);
        const otpCode = await this._adminService.sendOtpResetPasswordMail(
            payload.email,
            serverAuth
        );
        return h
            .response({
                status: "success",
                message: "OTP sent to email",
                data: {
                    otp_code: otpCode
                }
            })
            .code(200);
    }
    // End OTP Handler

    // Start Admin Handler
    async registerAdminHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IAdminWithOtp;
        const serverAuth = request.headers.authorization;
        await this._adminService.validateRegisterAdminPayload(payload);
        this._validator.validateAdminPayload(payload);
        const admin = await this._adminService.registerAdmin(payload, serverAuth);
        return h
            .response({
                status: "success",
                message: "Admin successfully registered",
                data: {
                    admin_id: admin
                }
            })
            .code(201);
    }

    async getAdminByIdHandler(request: Request, h: ResponseToolkit) {
        const admin = request.auth.credentials as unknown as IAuth;
        const adminData = await this._adminService.getAdminById(admin.id);
        return h
            .response({
                status: "success",
                message: "Admin fetched successfully",
                data: adminData
            })
            .code(200);
    }

    async editAdminHandler(request: Request, h: ResponseToolkit) {
        const admin = request.auth.credentials as unknown as IAuth;
        const payload = request.payload as IAdmin;
        await this._adminService.validateEditAdminPayload(payload);
        this._validator.validateEditAdminPayload(payload);
        await this._adminService.editAdmin(admin.id, payload);
        return h
            .response({
                status: "success",
                message: "Admin successfully edited"
            })
            .code(200);
    }

    async changePasswordHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IAdminWithNewPassword;
        const serverAuth = request.headers.authorization;
        await this._adminService.validateResetPasswordPayload(payload);
        this._validator.validateChangePasswordPayload(payload);
        await this._adminService.resetPassword(payload, serverAuth);
        return h
            .response({
                status: "success",
                message: "Password successfully changed"
            })
            .code(200);
    }

    async deleteAdminByIdHandler(request: Request, h: ResponseToolkit) {
        const admin = request.auth.credentials as unknown as IAuth;
        await this._adminService.deleteAdminById(admin.id);
        return h
            .response({
                status: "success",
                message: "Admin successfully deleted"
            })
            .code(200);
    }

    async deleteAllAdminsHandler(request: Request, h: ResponseToolkit) {
        const apiKey = request.query.api_key;
        await this._adminService.deleteAllAdmins(apiKey);
        return h
            .response({
                status: "success",
                message: "All admins successfully deleted"
            })
            .code(200);
    }
    // End Admin Handler

    // Start Admin Auth Handler
    async loginAdminHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IAdminWithOtp;
        const serverAuth = request.headers.authorization;
        await this._adminService.validateLoginAdminPayload(payload);
        this._validator.validateLoginAdminPayload(payload);
        const adminId = await this._adminService.loginAdmin(payload, serverAuth);
        const accessToken = this._tokenManager.generateAccessToken({ id: adminId });
        const refreshToken = this._tokenManager.generateRefreshToken({ id: adminId });
        await this._adminService.addAdminAuth({
            id: adminId,
            access_token: accessToken,
            refresh_token: refreshToken,
            role: "admin"
        });

        h.state(`refreshTokenAdmin`, refreshToken, {
            path: "/",
            isSecure: true,
            isHttpOnly: true,
            isSameSite: "Strict",
            ttl: 7 * 24 * 60 * 60 * 1000
        });

        return h
            .response({
                status: "success",
                message: "Admin successfully logged in",
                data: {
                    admin_id: adminId,
                    access_token: accessToken
                }
            })
            .code(200);
    }

    async editAdminAuthHandler(request: Request, h: ResponseToolkit) {
        const refreshToken = request.state[`refreshTokenAdmin`];
        const serverAuth = request.headers.authorization;
        const adminId = this._tokenManager.verifyRefreshToken(refreshToken);
        const accessToken = this._tokenManager.generateAccessToken({ id: adminId });
        await this._adminService.editAdminAuth(
            {
                access_token: accessToken,
                refresh_token: refreshToken
            } as IAuth,
            serverAuth
        );
        return h
            .response({
                status: "success",
                message: "Admin successfully edited",
                data: {
                    access_token: accessToken
                }
            })
            .code(200);
    }

    async logoutAdminHandler(request: Request, h: ResponseToolkit) {
        const refreshToken = request.state[`refreshTokenAdmin`];
        const serverAuth = request.headers.authorization;
        this._tokenManager.verifyRefreshToken(refreshToken);
        await this._adminService.logoutAdmin(refreshToken, serverAuth);

        h.unstate("refreshTokenAdmin", {
            path: "/",
            isSecure: true,
            isHttpOnly: true,
            isSameSite: "Strict"
        });

        return h
            .response({
                status: "success",
                message: "Admin successfully logged out"
            })
            .code(200);
    }
    // End Admin Auth Handler

    // Start Admin Key Handler
    async getAdminKeyHandler(request: Request, h: ResponseToolkit) {
        const adminKey = this._adminKey;
        const serverAuth = request.headers.authorization;
        await this._adminService.getAdminKey(serverAuth);
        return h
            .response({
                status: "success",
                message: "Admin key successfully retrieved",
                data: {
                    admin_key: adminKey
                }
            })
            .code(200);
    }
    // End Admin Key Handler
}

export default AdminHandler;
