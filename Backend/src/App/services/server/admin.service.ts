import type {
	IAdmin,
	IAdminWithOtp,
	IAdminWithNewPassword,
	IAuth
} from "../../../Common/models/types";
import bcrypt from "bcryptjs";
import config from "../../../Infrastructure/settings/config";
import AdminRepository from "../../../Infrastructure/repositories/server/postgres/admin.repo";
import MailRepository from "../../../Infrastructure/repositories/server/postgres/mail.repo";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import { nanoid } from "nanoid";
import {
	InvariantError,
	NotFoundError,
	AuthenticationError,
	AuthorizationError
} from "../../../Common/errors";

class AdminService {
	private readonly _adminRepository: AdminRepository;
	private readonly _mailRepository: MailRepository;
	private readonly _authRepository: AuthRepository;

	constructor(
		adminRepository: AdminRepository,
		mailRepository: MailRepository,
		authRepository: AuthRepository
	) {
		this._adminRepository = adminRepository;
		this._mailRepository = mailRepository;
		this._authRepository = authRepository;
	}

	// Start OTP Service
	async sendOtpMail(email: string, serverKey: string): Promise<number> {
		if (!serverKey) {
			throw new AuthenticationError("Unauthorized");
		}
		const apiKey = serverKey.split(" ")[1];
		if (apiKey !== config.jwt.serverKey) {
			throw new AuthorizationError("You are not authorized to send OTP");
		}
		const otpCode = Math.floor(100000 + Math.random() * 900000);
		await this._mailRepository.sendOtpRegisterMail(email, otpCode);
		await this._authRepository.addOtp(email, otpCode);
		return otpCode;
	}

	async sendOtpResetPasswordMail(email: string, serverKey: string): Promise<number> {
		if (!serverKey) {
			throw new AuthenticationError("Unauthorized");
		}
		const apiKey = serverKey.split(" ")[1];
		if (apiKey !== config.jwt.serverKey) {
			throw new AuthorizationError("You are not authorized to send OTP");
		}
		const otpCode = Math.floor(100000 + Math.random() * 900000);
		const admin = await this._adminRepository.getAdminByEmail(email);
		if (!admin) {
			throw new NotFoundError("Admin not found");
		}
		const adminName = `${admin.first_name} ${admin.last_name}`;
		await this._mailRepository.sendOtpResetPasswordMail(email, otpCode, adminName);
		await this._authRepository.addOtp(email, otpCode);
		return otpCode;
	}
	// End OTP Service

	// Start Admin Service
	async registerAdmin(payload: IAdminWithOtp, serverKey: string): Promise<string> {
		if (!serverKey) {
			throw new AuthenticationError("Unauthorized");
		}
		const apiKey = serverKey.split(" ")[1];
		if (apiKey !== config.jwt.serverKey) {
			throw new AuthorizationError("You are not authorized to register admin");
		}
		const id = `admin-${nanoid(10)}-${Date.now()}`;
		const password = payload.password;
		const retypePassword = payload.retype_password;
		if (password !== retypePassword) {
			throw new AuthenticationError("Password and retype password do not match");
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const adminEmail = await this._adminRepository.getAdminByEmail(payload.email);
		if (adminEmail) {
			throw new InvariantError("Email already exists");
		}
		const adminOTP = await this._authRepository.getOtpByEmail(payload.email);
		if (!adminOTP) {
			throw new NotFoundError("OTP code not found");
		}
		if (adminOTP.otp_code !== payload.otp_code) {
			throw new AuthenticationError("Invalid OTP code");
		}
		const admin = await this._adminRepository.addAdmin({
			...payload,
			password: hashedPassword,
			id
		});
		return admin;
	}

	async loginAdmin(payload: IAdminWithOtp, serverKey: string): Promise<string> {
		if (!serverKey) {
			throw new AuthenticationError("Unauthorized");
		}
		const apiKey = serverKey.split(" ")[1];
		if (apiKey !== config.jwt.serverKey) {
			throw new AuthorizationError("You are not authorized to login");
		}
		const admin = await this._adminRepository.getAdminByEmail(payload.email);
		if (!admin) {
			throw new AuthenticationError("Email or password or OTP code is incorrect");
		}

		const adminOTP = await this._authRepository.getOtpByEmail(payload.email);
		if (!adminOTP) {
			throw new AuthenticationError("Email or password or OTP code is incorrect");
		}

		const isMatch = await bcrypt.compare(payload.password, admin.password);
		if (!isMatch) {
			throw new AuthenticationError("Email or password or OTP code is incorrect");
		}

		if (adminOTP.otp_code !== payload.otp_code) {
			throw new AuthenticationError("Email or password or OTP code is incorrect");
		}

		return admin.id;
	}

	async editAdmin(id: string, payload: IAdmin): Promise<void> {
		const adminRole = await this._authRepository.getAdminRole(id);
		if (adminRole !== "admin") {
			throw new AuthorizationError("You are not authorized to edit this admin");
		}

		const admin = await this._adminRepository.getAdminById(id);
		if (!admin) {
			throw new NotFoundError("Admin not found");
		}

		const isMatch = await bcrypt.compare(payload.password, admin.password);
		if (!isMatch) {
			throw new AuthenticationError("Invalid password");
		}

		const editedAdmin = await this._adminRepository.editAdmin(id, payload);
		if (!editedAdmin) {
			throw new InvariantError("Failed to edit admin");
		}
	}

	async resetPassword(payload: IAdminWithNewPassword, serverKey: string): Promise<void> {
		if (!serverKey) {
			throw new AuthenticationError("Unauthorized");
		}
		const apiKey = serverKey.split(" ")[1];
		if (apiKey !== config.jwt.serverKey) {
			throw new AuthorizationError("You are not authorized to reset password");
		}
		const admin = await this._adminRepository.getAdminByEmail(payload.email);
		if (!admin) {
			throw new NotFoundError("Admin not found");
		}

		const password = payload.new_password;
		const retypePassword = payload.retype_password;
		if (password !== retypePassword) {
			throw new AuthenticationError("Password and retype password do not match");
		}

		const adminOTP = await this._authRepository.getOtpByEmail(payload.email);
		if (!adminOTP) {
			throw new NotFoundError("OTP code not found");
		}

		if (adminOTP.otp_code !== payload.otp_code) {
			throw new AuthenticationError("Invalid OTP code");
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		await this._adminRepository.editAdminPassword(admin.id, hashedPassword);
	}

	async deleteAdminById(id: string): Promise<void> {
		const adminRole = await this._authRepository.getAdminRole(id);
		if (adminRole !== "admin") {
			throw new AuthorizationError("You are not authorized to delete this admin");
		}
		const admin = await this._adminRepository.getAdminById(id);
		if (!admin) {
			throw new NotFoundError("Admin not found");
		}
		await this._adminRepository.deleteAdminById(id);
	}

	async deleteAllAdmins(apiKey: string): Promise<void> {
		if (apiKey !== process.env.API_KEY) {
			throw new AuthenticationError("Invalid API key");
		}
		await this._adminRepository.deleteAllAdmins();
	}
	// End Admin Service

	// Start Admin Auth Service
	async addAdminAuth(payload: IAuth): Promise<void> {
		const admin = await this._adminRepository.getAdminById(payload.id);
		if (admin) {
			await this._authRepository.addAdminAuth({ ...payload, id: admin.id });
		}
	}

	async editAdminAuth(payload: IAuth, serverKey: string): Promise<void> {
		if (!serverKey) {
			throw new AuthenticationError("Unauthorized");
		}
		const apiKey = serverKey.split(" ")[1];
		if (apiKey !== config.jwt.serverKey) {
			throw new AuthorizationError("You are not authorized to edit admin auth");
		}
		const adminAuth = await this._authRepository.getAdminAuth(payload.refresh_token);
		if (!adminAuth) {
			throw new NotFoundError("Admin not found");
		}
		await this._authRepository.editAdminAuth(payload.access_token, payload.refresh_token);
	}

	async logoutAdmin(refreshToken: string, serverAuth: string): Promise<void> {
		if (!serverAuth) {
			throw new AuthenticationError("Unauthorized");
		}
		const apiKey = serverAuth.split(" ")[1];
		if (apiKey !== config.jwt.serverKey) {
			throw new AuthorizationError("You are not authorized to logout");
		}
		const adminAuth = await this._authRepository.getAdminAuth(refreshToken);
		if (!adminAuth) {
			throw new NotFoundError("Admin not found");
		}
		await this._authRepository.deleteAdminAuth(refreshToken);
	}
	// End Admin Auth Service
}

export default AdminService;
