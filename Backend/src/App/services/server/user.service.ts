import type {
    IUser,
    IUserWithOtp,
    IUserWithNewPassword,
    IAuth
} from "../../../Common/models/types";
import bcrypt from "bcryptjs";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";
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

class UserService {
    private readonly _userRepository: UserRepository;
    private readonly _mailRepository: MailRepository;
    private readonly _authRepository: AuthRepository;
    private readonly _redisRepository: RedisRepository;
    private readonly _serverKey: string;
    constructor(
        userRepository: UserRepository,
        mailRepository: MailRepository,
        authRepository: AuthRepository,
        redisRepository: RedisRepository,
        serverKey: string
    ) {
        this._userRepository = userRepository;
        this._mailRepository = mailRepository;
        this._authRepository = authRepository;
        this._redisRepository = redisRepository;
        this._serverKey = serverKey;
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
        const user = await this._userRepository.getUserByEmail(email);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const userName = `${user.first_name} ${user.last_name}`;
        await this._mailRepository.sendOtpResetPasswordMail(email, otpCode, userName);
        await this._authRepository.addOtp(email, otpCode);
        return otpCode;
    }
    // End OTP Service

    // Start User Service
    async validateRegisterUserPayload(payload: IUserWithOtp): Promise<void> {
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
        if (!payload.phone_number) {
            throw new InvariantError("Phone number is required");
        }
        if (!payload.otp_code) {
            throw new InvariantError("OTP code is required");
        }
    }

    async registerUser(payload: IUserWithOtp, serverKey: string): Promise<string> {
        if (!serverKey) {
            throw new AuthenticationError("Unauthorized");
        }
        const apiKey = serverKey.split(" ")[1];
        if (apiKey !== this._serverKey) {
            throw new AuthorizationError("You are not authorized to register user");
        }
        const id = `user-${nanoid(10)}-${Date.now()}`;
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        const userEmail = await this._userRepository.getUserByEmail(payload.email);
        if (userEmail) {
            throw new ConflictError("Email already exists");
        }
        const userOTP = await this._authRepository.getOtpByEmail(payload.email);
        if (!userOTP) {
            throw new NotFoundError("OTP code not found");
        }
        if (userOTP.otp_code !== payload.otp_code) {
            throw new AuthenticationError("Invalid OTP code");
        }
        const user = await this._userRepository.addUser({
            ...payload,
            password: hashedPassword,
            id
        });
        await this._redisRepository.delete(`user:${id}`);
        return user;
    }

    async validateLoginUserPayload(payload: IUser): Promise<void> {
        if (!payload.email) {
            throw new InvariantError("Email is required");
        }
        if (!payload.password) {
            throw new InvariantError("Password is required");
        }
    }

    async loginUser(payload: IUser, serverKey: string): Promise<string> {
        if (!serverKey) {
            throw new AuthenticationError("Unauthorized");
        }
        const apiKey = serverKey.split(" ")[1];
        if (apiKey !== this._serverKey) {
            throw new AuthorizationError("You are not authorized to login");
        }
        const user = await this._userRepository.getUserByEmail(payload.email);
        if (!user) {
            throw new NotFoundError("Email or password is incorrect");
        }
        const isMatch = await bcrypt.compare(payload.password, user.password);
        if (!isMatch) {
            throw new AuthenticationError("Email or password is incorrect");
        }
        await this._redisRepository.delete(`user:${user.id}`);
        return user.id;
    }

    async getUserById(id: string): Promise<{ user: IUser; source: string }> {
        const cachedUser = await this._redisRepository.get(`user:${id}`);
        if (cachedUser) {
            return {
                user: JSON.parse(cachedUser),
                source: "cache"
            };
        }
        const userRole = await this._authRepository.getUserRole(id);
        if (userRole !== "user") {
            throw new AuthorizationError("You are not authorized to get this user");
        }
        const user = await this._userRepository.getUserById(id);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const userWithoutPassword = {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number,
            photo: user.photo
        };
        await this._redisRepository.set(`user:${id}`, userWithoutPassword);
        return {
            user: userWithoutPassword as IUser,
            source: "database"
        };
    }

    async validateEditUserPayload(payload: IUser): Promise<void> {
        if (!payload.password) {
            throw new InvariantError("Password is required");
        }
    }

    async editUser(id: string, payload: IUser): Promise<void> {
        const userRole = await this._authRepository.getUserRole(id);
        if (userRole !== "user") {
            throw new AuthorizationError("You are not authorized to edit this user");
        }
        const user = await this._userRepository.getUserById(id);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const isMatch = await bcrypt.compare(payload.password, user.password);
        if (!isMatch) {
            throw new AuthenticationError("Invalid password");
        }
        const editedUser = await this._userRepository.editUser(id, payload);
        if (!editedUser) {
            throw new InvariantError("Failed to edit user");
        }
        await this._redisRepository.delete(`user:${id}`);
    }

    async validateResetPasswordPayload(payload: IUserWithNewPassword): Promise<void> {
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

    async resetPassword(payload: IUserWithNewPassword, serverKey: string): Promise<void> {
        if (!serverKey) {
            throw new AuthenticationError("Unauthorized");
        }
        const apiKey = serverKey.split(" ")[1];
        if (apiKey !== this._serverKey) {
            throw new AuthorizationError("You are not authorized to reset password");
        }
        const user = await this._userRepository.getUserByEmail(payload.email);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const userOTP = await this._authRepository.getOtpByEmail(payload.email);
        if (!userOTP) {
            throw new NotFoundError("OTP code not found");
        }
        if (userOTP.otp_code !== payload.otp_code) {
            throw new AuthenticationError("Invalid OTP code");
        }
        const hashedPassword = await bcrypt.hash(payload.new_password, 10);
        await this._userRepository.editUserPassword(user.id, hashedPassword);
        await this._redisRepository.delete(`user:${user.id}`);
    }

    async deleteUserById(id: string): Promise<void> {
        const userRole = await this._authRepository.getUserRole(id);
        if (userRole !== "user") {
            throw new AuthorizationError("You are not authorized to delete this user");
        }
        const user = await this._userRepository.getUserById(id);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        await this._redisRepository.delete(`user:${id}`);
        await this._userRepository.deleteUserById(id);
    }

    async deleteAllUsers(apiKey: string): Promise<void> {
        if (apiKey !== process.env.API_KEY) {
            throw new AuthenticationError("Invalid API key");
        }
        await this._userRepository.deleteAllUsers();
    }
    // End User Service

    // Start User Auth Service
    async addUserAuth(payload: IAuth, serverKey: string): Promise<void> {
        if (!serverKey) {
            throw new AuthenticationError("Unauthorized");
        }
        const apiKey = serverKey.split(" ")[1];
        if (apiKey !== this._serverKey) {
            throw new AuthorizationError("You are not authorized to add user auth");
        }
        const user = await this._userRepository.getUserById(payload.id);
        if (user) {
            await this._authRepository.addUserAuth({ ...payload, id: user.id });
        }
    }

    async editUserAuth(
        accessToken: string,
        refreshToken: string,
        serverKey: string
    ): Promise<void> {
        if (!serverKey) {
            throw new AuthenticationError("Unauthorized");
        }
        const apiKey = serverKey.split(" ")[1];
        if (apiKey !== this._serverKey) {
            throw new AuthorizationError("You are not authorized to edit user auth");
        }
        if (!refreshToken) {
            throw new AuthenticationError("Unauthorized");
        }
        const userAuth = await this._authRepository.getUserAuth(refreshToken);
        if (!userAuth) {
            throw new NotFoundError("User not found");
        }
        await this._authRepository.editUserAuth(accessToken, refreshToken);
    }

    async logoutUser(refreshToken: string, serverKey: string): Promise<void> {
        if (!serverKey) {
            throw new AuthenticationError("Unauthorized");
        }
        const apiKey = serverKey.split(" ")[1];
        if (apiKey !== this._serverKey) {
            throw new AuthorizationError("You are not authorized to logout user");
        }
        if (!refreshToken) {
            throw new AuthenticationError("Unauthorized");
        }
        const userAuth = await this._authRepository.getUserAuth(refreshToken);
        if (!userAuth) {
            throw new NotFoundError("User not found");
        }
        await this._authRepository.deleteUserAuth(refreshToken);
    }
    // End User Auth Service
}

export default UserService;
