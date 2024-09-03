import type { Request, ResponseToolkit } from "@hapi/hapi";
import type {
	IAdmin,
	IAdminWithOtp,
	IAdminWithNewPassword,
	IAuth
} from "../../../Common/models/types";
import autoBind from "auto-bind";
import AdminService from "../../../App/services/admin.service";
import AdminValidator from "../../../App/validators/admins";
import TokenManager from "../../../Common/tokens/manager.token";

class AdminHandler {
	private readonly _adminService: AdminService;
	private readonly _validator: typeof AdminValidator;
	private readonly _tokenManager: typeof TokenManager;

	constructor(
		adminService: AdminService,
		validator: typeof AdminValidator,
		tokenManager: typeof TokenManager
	) {
		this._adminService = adminService;
		this._validator = validator;
		this._tokenManager = tokenManager;
		autoBind(this);
	}

	// Start OTP Handler
	async sendOtpMailHandler(request: Request, h: ResponseToolkit) {
		const payload = request.payload as IAdmin;
		this._validator.validateSendOtpPayload(payload);
		const otpCode = await this._adminService.sendOtpMail(payload.email);
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
		this._validator.validateSendOtpPayload(payload);
		const otpCode = await this._adminService.sendOtpResetPasswordMail(payload.email);
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
		this._validator.validateAdminPayload(payload);
		const admin = await this._adminService.registerAdmin(payload);
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

	async editAdminHandler(request: Request, h: ResponseToolkit) {
		const admin = request.auth.credentials as unknown as IAuth;
		const payload = request.payload as IAdmin;
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
		this._validator.validateChangePasswordPayload(payload);
		await this._adminService.resetPassword(payload);
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
		const payload = request.payload as IAdmin;
		this._validator.validateLoginAdminPayload(payload);
		const adminId = await this._adminService.loginAdmin(payload);
		const accessToken = this._tokenManager.generateAccessToken({ id: adminId });
		const refreshToken = this._tokenManager.generateRefreshToken({ id: adminId });
		await this._adminService.addAdminAuth({
			id: adminId,
			access_token: accessToken,
			refresh_token: refreshToken,
			role: "admin"
		});
		return h
			.response({
				status: "success",
				message: "Admin successfully logged in",
				data: {
					admin_id: adminId,
					access_token: accessToken,
					refresh_token: refreshToken
				}
			})
			.code(200);
	}

	async editAdminAuthHandler(request: Request, h: ResponseToolkit) {
		const payload = request.payload as IAuth;
		this._validator.validateAdminAuthPayload(payload);
		const adminId = this._tokenManager.verifyRefreshToken(payload.refresh_token);
		const accessToken = this._tokenManager.generateAccessToken({ id: adminId });
		await this._adminService.editAdminAuth({
			access_token: accessToken,
			refresh_token: payload.refresh_token
		} as IAuth);
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
		const payload = request.payload as IAuth;
		this._validator.validateAdminAuthPayload(payload);
		this._tokenManager.verifyRefreshToken(payload.refresh_token);
		await this._adminService.logoutAdmin(payload.refresh_token);
		return h
			.response({
				status: "success",
				message: "Admin successfully logged out"
			})
			.code(200);
	}
	// End Admin Auth Handler
}

export default AdminHandler;
