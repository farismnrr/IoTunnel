import type {
	IUser,
	IUserWithOtp,
	IUserWithNewPassword,
	IAuth
} from "../../../Common/models/types";
import bcrypt from "bcryptjs";
import config from "../../../Infrastructure/settings/config";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";
import MailRepository from "../../../Infrastructure/repositories/server/postgres/mail.repo";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import { nanoid } from "nanoid";
import {
	InvariantError,
	NotFoundError,
	AuthenticationError,
	AuthorizationError
} from "../../../Common/errors";

class UserService {
	private readonly _userRepository: UserRepository;
	private readonly _mailRepository: MailRepository;
	private readonly _authRepository: AuthRepository;

	constructor(
		userRepository: UserRepository,
		mailRepository: MailRepository,
		authRepository: AuthRepository
	) {
		this._userRepository = userRepository;
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
	async registerUser(payload: IUserWithOtp, serverKey: string): Promise<string> {
		if (!serverKey) {
			throw new AuthenticationError("Unauthorized");
		}
		const apiKey = serverKey.split(" ")[1];
		if (apiKey !== config.jwt.serverKey) {
			throw new AuthorizationError("You are not authorized to register user");
		}
		const id = `user-${nanoid(10)}-${Date.now()}`;
		const password = payload.password;
		const retypePassword = payload.retype_password;
		if (password !== retypePassword) {
			throw new AuthenticationError("Password and retype password do not match");
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const userEmail = await this._userRepository.getUserByEmail(payload.email);
		if (userEmail) {
			throw new InvariantError("Email already exists");
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
		return user;
	}

	async loginUser(payload: IUser, serverKey: string): Promise<string> {
		if (!serverKey) {
			throw new AuthenticationError("Unauthorized");
		}
		const apiKey = serverKey.split(" ")[1];
		if (apiKey !== config.jwt.serverKey) {
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

		return user.id;
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
	}

	async resetPassword(payload: IUserWithNewPassword, serverKey: string): Promise<void> {
		if (!serverKey) {
			throw new AuthenticationError("Unauthorized");
		}
		const apiKey = serverKey.split(" ")[1];
		if (apiKey !== config.jwt.serverKey) {
			throw new AuthorizationError("You are not authorized to reset password");
		}
		const user = await this._userRepository.getUserByEmail(payload.email);
		if (!user) {
			throw new NotFoundError("User not found");
		}

		const password = payload.new_password;
		const retypePassword = payload.retype_password;
		if (password !== retypePassword) {
			throw new AuthenticationError("Password and retype password do not match");
		}

		const userOTP = await this._authRepository.getOtpByEmail(payload.email);
		if (!userOTP) {
			throw new NotFoundError("OTP code not found");
		}

		if (userOTP.otp_code !== payload.otp_code) {
			throw new AuthenticationError("Invalid OTP code");
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		await this._userRepository.editUserPassword(user.id, hashedPassword);
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
	async addUserAuth(payload: IAuth): Promise<void> {
		const user = await this._userRepository.getUserById(payload.id);
		if (user) {
			await this._authRepository.addUserAuth({ ...payload, id: user.id });
		}
	}

	async editUserAuth(payload: IAuth, serverAuth: string): Promise<void> {
		if (!serverAuth) {
			throw new AuthenticationError("Unauthorized");
		}
		const apiKey = serverAuth.split(" ")[1];
		if (apiKey !== config.jwt.serverKey) {
			throw new AuthorizationError("You are not authorized to edit user auth");
		}
		const userAuth = await this._authRepository.getUserAuth(payload.refresh_token);
		if (!userAuth) {
			throw new NotFoundError("User not found");
		}
		await this._authRepository.editUserAuth(payload.access_token, payload.refresh_token);
	}

	async logoutUser(refreshToken: string, serverAuth: string): Promise<void> {
		if (!serverAuth) {
			throw new AuthenticationError("Unauthorized");
		}
		const apiKey = serverAuth.split(" ")[1];
		if (apiKey !== config.jwt.serverKey) {
			throw new AuthorizationError("You are not authorized to logout user");
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
