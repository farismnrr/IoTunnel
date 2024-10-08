import type { Request, ResponseToolkit } from "@hapi/hapi";
import type {
    IAdmin,
    IAdminWithOtp,
    IAdminWithNewPassword,
    IAuth,
    IAuthState
} from "../../../Common/models/types";
import autoBind from "auto-bind";
import AdminValidator from "../../../App/validators/admins";
import TokenManager from "../../../Common/manager/manager.token";
import AdminService from "../../../App/services/server/admin.service";
import ResponseManager from "../../../Common/manager/manager.response";

class AdminHandler {
    private readonly _adminService: AdminService;
    private readonly _validator: typeof AdminValidator;
    private readonly _tokenManager: typeof TokenManager;
    private readonly _responseManager: typeof ResponseManager;
    private readonly _adminKey: string;

    constructor(
        adminService: AdminService,
        validator: typeof AdminValidator,
        tokenManager: typeof TokenManager,
        responseManager: typeof ResponseManager,
        adminKey: string
    ) {
        this._adminService = adminService;
        this._validator = validator;
        this._tokenManager = tokenManager;
        this._responseManager = responseManager;
        this._adminKey = adminKey;
        autoBind(this);
    }

    // Start OTP Handler
    async sendOtpMailHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IAdmin;
        const serverAuth = request.headers.authorization;
        this._validator.validateSendOtpPayload(payload);
        const otpCode = await this._adminService.sendOtpMail(payload.email, serverAuth);
        const response = {
            status: "success",
            message: "OTP sent to email",
            data: {
                otp_code: otpCode
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async sendOtpResetPasswordHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IAdmin;
        const serverAuth = request.headers.authorization;
        this._validator.validateSendOtpPayload(payload);
        const otpCode = await this._adminService.sendOtpResetPasswordMail(
            payload.email,
            serverAuth
        );
        const response = {
            status: "success",
            message: "OTP sent to email",
            data: {
                otp_code: otpCode
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }
    // End OTP Handler

    // Start Admin Handler
    async registerAdminHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IAdminWithOtp;
        const serverAuth = request.headers.authorization;
        await this._adminService.validateRegisterAdminPayload(payload);
        this._validator.validateAdminPayload(payload);
        const admin = await this._adminService.registerAdmin(payload, serverAuth);
        const response = {
            status: "success",
            message: "Admin successfully registered",
            data: {
                admin_id: admin
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(201);
    }

    async getAdminByIdHandler(request: Request, h: ResponseToolkit) {
        const admin = request.auth.credentials as unknown as IAuth;
        const adminData = await this._adminService.getAdminById(admin.id);
        const response = {
            status: "success",
            message: "Admin fetched successfully",
            data: adminData
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async editAdminHandler(request: Request, h: ResponseToolkit) {
        const admin = request.auth.credentials as unknown as IAuth;
        const payload = request.payload as IAdmin;
        await this._adminService.validateEditAdminPayload(payload);
        this._validator.validateEditAdminPayload(payload);
        await this._adminService.editAdmin(admin.id, payload);
        const response = {
            status: "success",
            message: "Admin successfully edited"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async changePasswordHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IAdminWithNewPassword;
        const serverAuth = request.headers.authorization;
        await this._adminService.validateResetPasswordPayload(payload);
        this._validator.validateChangePasswordPayload(payload);
        await this._adminService.resetPassword(payload, serverAuth);
        const response = {
            status: "success",
            message: "Password successfully changed"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async deleteAdminByIdHandler(request: Request, h: ResponseToolkit) {
        const admin = request.auth.credentials as unknown as IAuth;
        await this._adminService.deleteAdminById(admin.id);
        const response = {
            status: "success",
            message: "Admin successfully deleted"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async deleteAllAdminsHandler(request: Request, h: ResponseToolkit) {
        const apiKey = request.query.api_key;
        await this._adminService.deleteAllAdmins(apiKey);
        const response = {
            status: "success",
            message: "All admins successfully deleted"
        };
        return h.response(response).code(200);
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
        await this._adminService.addAdminAuth(
            {
                id: adminId,
                access_token: accessToken,
                refresh_token: refreshToken,
                role: "admin"
            },
            serverAuth
        );

        const response = {
            status: "success",
            message: "Admin successfully logged in",
            data: {
                admin_id: adminId,
                access_token: accessToken,
                refresh_token: refreshToken
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async editAdminAuthHandler(request: Request, h: ResponseToolkit) {
        const serverAuth = request.headers.authorization;
        let accessToken: string;
        if (process.env.NODE_ENV === "production") {
            const payload = request.payload;
            const decryptedPayload = this._responseManager.decrypt(payload as string) as IAuthState;
            const decryptedRefreshToken = decryptedPayload.data;
            if (!decryptedRefreshToken) {
                throw new Error("Invalid refresh token");
            }
            const adminId = this._tokenManager.verifyRefreshToken(
                decryptedRefreshToken.refresh_token
            );
            accessToken = this._tokenManager.generateAccessToken({ id: adminId });
            await this._adminService.editAdminAuth(
                accessToken,
                decryptedRefreshToken.refresh_token,
                serverAuth
            );
        } else {
            const payload = request.payload as IAuth;
            const adminId = this._tokenManager.verifyRefreshToken(payload.refresh_token);
            accessToken = this._tokenManager.generateAccessToken({ id: adminId });
            await this._adminService.editAdminAuth(accessToken, payload.refresh_token, serverAuth);
        }

        const response = {
            status: "success",
            message: "Admin successfully edited",
            data: {
                access_token: accessToken
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async logoutAdminHandler(request: Request, h: ResponseToolkit) {
        const serverAuth = request.headers.authorization;
        let refreshToken: string;
        if (process.env.NODE_ENV === "production") {
            const payload = request.payload;
            const decryptedPayload = this._responseManager.decrypt(payload as string) as IAuthState;
            const decryptedRefreshToken = decryptedPayload.data;
            if (!decryptedRefreshToken) {
                throw new Error("Invalid refresh token");
            }
            refreshToken = decryptedRefreshToken.refresh_token;
        } else {
            const payload = request.payload as IAuth;
            refreshToken = payload.refresh_token;
        }

        this._tokenManager.verifyRefreshToken(refreshToken);
        await this._adminService.logoutAdmin(refreshToken, serverAuth);

        const response = {
            status: "success",
            message: "Admin successfully logged out"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }
    // End Admin Auth Handler

    // Start Admin Key Handler
    async getAdminKeyHandler(request: Request, h: ResponseToolkit) {
        const adminKey = this._adminKey;
        const serverAuth = request.headers.authorization;
        await this._adminService.getAdminKey(serverAuth);
        const response = {
            status: "success",
            message: "Admin key successfully retrieved",
            data: {
                admin_key: adminKey
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }
    // End Admin Key Handler
}

export default AdminHandler;
