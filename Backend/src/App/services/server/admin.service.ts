import type {
    IAdmin,
    IAdminWithOtp,
    IAdminWithNewPassword,
    IAuth
} from "../../../Common/models/types";
import bcrypt from "bcryptjs";
import AdminRepository from "../../../Infrastructure/repositories/server/postgres/admin.repo";
import MailRepository from "../../../Infrastructure/repositories/server/mail/mail.repo";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import RedisRepository from "../../../Infrastructure/repositories/server/cache/redis.repo";
import { nanoid } from "nanoid";
import {
    InvariantError,
    NotFoundError,
    AuthenticationError,
    AuthorizationError,
    ConflictError
} from "../../../Common/errors";

class AdminService {
    private readonly _adminRepository: AdminRepository;
    private readonly _mailRepository: MailRepository;
    private readonly _authRepository: AuthRepository;
    private readonly _redisRepository: RedisRepository;
    private readonly _serverKey: string;
    private readonly _adminKey: string;
    constructor(
        adminRepository: AdminRepository,
        mailRepository: MailRepository,
        authRepository: AuthRepository,
        redisRepository: RedisRepository,
        serverKey: string,
        adminKey: string
    ) {
        this._adminRepository = adminRepository;
        this._mailRepository = mailRepository;
        this._authRepository = authRepository;
        this._redisRepository = redisRepository;
        this._serverKey = serverKey;
        this._adminKey = adminKey;
    }

    // Start OTP Service
    async sendOtpMail(email: string, serverKey: string): Promise<number> {
        if (!serverKey) {
            throw new AuthenticationError("Unauthorized");
        }
        const apiKey = serverKey.split(" ")[1];
        if (apiKey !== this._serverKey) {
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
        if (apiKey !== this._serverKey) {
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
    async validateRegisterAdminPayload(payload: IAdminWithOtp): Promise<void> {
        if (!payload.first_name) {
            throw new InvariantError("First name is required");
        }
        if (!payload.last_name) {
            throw new InvariantError("Last name is required");
        }
        if (!payload.email) {
            throw new InvariantError("Email is required");
        }
        if (!payload.password) {
            throw new InvariantError("Password is required");
        }
        if (!payload.retype_password) {
            throw new InvariantError("Retype password is required");
        }
        if (payload.password !== payload.retype_password) {
            throw new AuthenticationError("Password and retype password do not match");
        }
        if (!payload.otp_code) {
            throw new InvariantError("OTP code is required");
        }
        if (!payload.admin_key) {
            throw new InvariantError("Admin key is required");
        }
    }

    async registerAdmin(payload: IAdminWithOtp, serverKey: string): Promise<string> {
        if (!serverKey) {
            throw new AuthenticationError("Unauthorized");
        }
        const apiKey = serverKey.split(" ")[1];
        if (apiKey !== this._serverKey) {
            throw new AuthorizationError("You are not authorized to register admin");
        }
        const id = `admin-${nanoid(10)}-${Date.now()}`;
        if (payload.admin_key !== this._adminKey) {
            throw new AuthorizationError("You are not authorized to register admin");
        }
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        const adminEmail = await this._adminRepository.getAdminByEmail(payload.email);
        if (adminEmail) {
            throw new ConflictError("Email already exists");
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
        await this._redisRepository.delete(`admin:${id}`);
        return admin;
    }

    async validateLoginAdminPayload(payload: IAdminWithOtp): Promise<void> {
        if (!payload.email) {
            throw new InvariantError("Email is required");
        }
        if (!payload.password) {
            throw new InvariantError("Password is required");
        }
        if (!payload.otp_code) {
            throw new InvariantError("OTP code is required");
        }
    }

    async loginAdmin(payload: IAdminWithOtp, serverKey: string): Promise<string> {
        if (!serverKey) {
            throw new AuthenticationError("Unauthorized");
        }
        const apiKey = serverKey.split(" ")[1];
        if (apiKey !== this._serverKey) {
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
        await this._redisRepository.delete(`admin:${admin.id}`);
        return admin.id;
    }

    async getAdminById(id: string): Promise<{ admin: IAdmin; source: string }> {
        const adminCache = await this._redisRepository.get(`admin:${id}`);
        if (adminCache) {
            return {
                admin: JSON.parse(adminCache),
                source: "cache"
            };
        }
        const adminRole = await this._authRepository.getAdminRole(id);
        if (adminRole !== "admin") {
            throw new AuthorizationError("You are not authorized to get this admin");
        }
        const admin = await this._adminRepository.getAdminById(id);
        if (!admin) {
            throw new NotFoundError("Admin not found");
        }
        const adminWithoutPassword = {
            id: admin.id,
            email: admin.email,
            first_name: admin.first_name,
            last_name: admin.last_name,
            photo: admin.photo
        };
        await this._redisRepository.set(`admin:${id}`, adminWithoutPassword);
        return {
            admin: adminWithoutPassword as IAdmin,
            source: "database"
        };
    }

    async validateEditAdminPayload(payload: IAdmin): Promise<void> {
        if (!payload.password) {
            throw new InvariantError("Password is required");
        }
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
        await this._redisRepository.delete(`admin:${id}`);
    }

    async validateResetPasswordPayload(payload: IAdminWithNewPassword): Promise<void> {
        if (!payload.email) {
            throw new InvariantError("Email is required");
        }
        if (!payload.new_password) {
            throw new InvariantError("New password is required");
        }
        if (!payload.retype_password) {
            throw new InvariantError("Retype password is required");
        }
        if (payload.new_password !== payload.retype_password) {
            throw new AuthenticationError("New password and retype password do not match");
        }
        if (!payload.otp_code) {
            throw new InvariantError("OTP code is required");
        }
    }

    async resetPassword(payload: IAdminWithNewPassword, serverKey: string): Promise<void> {
        if (!serverKey) {
            throw new AuthenticationError("Unauthorized");
        }
        const apiKey = serverKey.split(" ")[1];
        if (apiKey !== this._serverKey) {
            throw new AuthorizationError("You are not authorized to reset password");
        }
        const admin = await this._adminRepository.getAdminByEmail(payload.email);
        if (!admin) {
            throw new NotFoundError("Admin not found");
        }

        const adminOTP = await this._authRepository.getOtpByEmail(payload.email);
        if (!adminOTP) {
            throw new NotFoundError("OTP code not found");
        }

        if (adminOTP.otp_code !== payload.otp_code) {
            throw new AuthenticationError("Invalid OTP code");
        }

        const hashedPassword = await bcrypt.hash(payload.new_password, 10);
        await this._redisRepository.delete(`admin:${admin.id}`);
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
        await this._redisRepository.delete(`admin:${id}`);
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
    async addAdminAuth(payload: IAuth, serverKey: string): Promise<void> {
        if (!serverKey) {
            throw new AuthenticationError("Unauthorized");
        }
        const apiKey = serverKey.split(" ")[1];
        if (apiKey !== this._serverKey) {
            throw new AuthorizationError("You are not authorized to add admin auth");
        }
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
        if (apiKey !== this._serverKey) {
            throw new AuthorizationError("You are not authorized to edit admin auth");
        }
        if (!payload.refresh_token) {
            throw new AuthenticationError("Unauthorized");
        }
        const adminAuth = await this._authRepository.getAdminAuth(payload.refresh_token);
        if (!adminAuth) {
            throw new NotFoundError("Admin not found");
        }
        await this._authRepository.editAdminAuth(payload.access_token, payload.refresh_token);
    }

    async logoutAdmin(refreshToken: string, serverKey: string): Promise<void> {
        if (!serverKey) {
            throw new AuthenticationError("Unauthorized");
        }
        const apiKey = serverKey.split(" ")[1];
        if (apiKey !== this._serverKey) {
            throw new AuthorizationError("You are not authorized to logout admin");
        }
        if (!refreshToken) {
            throw new AuthenticationError("Unauthorized");
        }
        const adminAuth = await this._authRepository.getAdminAuth(refreshToken);
        if (!adminAuth) {
            throw new NotFoundError("Admin not found");
        }
        await this._authRepository.deleteAdminAuth(refreshToken);
    }
    // End Admin Auth Service

    // Start Admin Key Service
    async getAdminKey(serverAuth: string): Promise<void> {
        if (!serverAuth) {
            throw new AuthenticationError("Unauthorized");
        }
        const apiKey = serverAuth.split(" ")[1];
        if (apiKey !== this._serverKey) {
            throw new AuthorizationError("You are not authorized to get admin key");
        }
    }
    // End Admin Key Service
}

export default AdminService;
