import type { Request, ResponseToolkit } from "@hapi/hapi";
import type {
    IUser,
    IUserWithOtp,
    IUserWithNewPassword,
    IAuth,
    IAuthState
} from "../../../Common/models/types";
import autoBind from "auto-bind";
import UserService from "../../../App/services/server/user.service";
import ProductService from "../../../App/services/server/product.service";
import UserValidator from "../../../App/validators/users";
import TokenManager from "../../../Common/manager/manager.token";
import ResponseManager from "../../../Common/manager/manager.response";

class UserHandler {
    private readonly _userService: UserService;
    private readonly _productService: ProductService;
    private readonly _validator: typeof UserValidator;
    private readonly _tokenManager: typeof TokenManager;
    private readonly _responseManager: typeof ResponseManager;
    constructor(
        userService: UserService,
        productService: ProductService,
        validator: typeof UserValidator,
        tokenManager: typeof TokenManager,
        responseManager: typeof ResponseManager
    ) {
        this._userService = userService;
        this._productService = productService;
        this._validator = validator;
        this._tokenManager = tokenManager;
        this._responseManager = responseManager;
        autoBind(this);
    }

    // Start OTP Handler
    async sendOtpMailHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IUser;
        const serverAuth = request.headers.authorization;
        this._validator.validateSendOtpPayload(payload);
        const otpCode = await this._userService.sendOtpMail(payload.email, serverAuth);
        const response = {
            status: "success",
            message: "OTP sent to email",
            data: {
                otp_code: otpCode
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        // const decryptedResponse = this._responseManager.decrypt(encryptedResponse as string);
        return h.response(encryptedResponse).code(200);
    }

    async sendOtpResetPasswordHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IUser;
        const serverAuth = request.headers.authorization;
        this._validator.validateSendOtpPayload(payload);
        const otpCode = await this._userService.sendOtpResetPasswordMail(payload.email, serverAuth);
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

    // Start User Handler
    async registerUserHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IUserWithOtp;
        const serverAuth = request.headers.authorization;
        await this._userService.validateRegisterUserPayload(payload);
        this._validator.validateUserPayload(payload);
        const trial = await this._productService.addTrialByUserEmail(payload.email);
        const user = await this._userService.registerUser(payload, serverAuth);
        const response = {
            status: "success",
            message: "User successfully registered",
            data: {
                user_id: user,
                free_trial: trial
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(201);
    }

    async getUserByIdHandler(request: Request, h: ResponseToolkit) {
        const user = request.auth.credentials as unknown as IAuth;
        const userData = await this._userService.getUserById(user.id);
        const response = {
            status: "success",
            message: "User fetched successfully",
            data: userData
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async editUserHandler(request: Request, h: ResponseToolkit) {
        const user = request.auth.credentials as unknown as IAuth;
        const payload = request.payload as IUser;
        await this._userService.validateEditUserPayload(payload);
        this._validator.validateEditUserPayload(payload);
        await this._userService.editUser(user.id, payload);
        const response = {
            status: "success",
            message: "User successfully edited"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async changePasswordHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IUserWithNewPassword;
        const serverAuth = request.headers.authorization;
        this._validator.validateChangePasswordPayload(payload);
        await this._userService.resetPassword(payload, serverAuth);
        const response = {
            status: "success",
            message: "Password successfully changed"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async deleteUserByIdHandler(request: Request, h: ResponseToolkit) {
        const user = request.auth.credentials as unknown as IAuth;
        await this._userService.deleteUserById(user.id);
        const response = {
            status: "success",
            message: "User successfully deleted"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async deleteAllUsersHandler(request: Request, h: ResponseToolkit) {
        const apiKey = request.query.api_key;
        await this._userService.deleteAllUsers(apiKey);
        const response = {
            status: "success",
            message: "All users successfully deleted"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }
    // End User Handler

    // Start User Auth Handler
    async loginUserHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IUser;
        const serverAuth = request.headers.authorization;
        await this._userService.validateLoginUserPayload(payload);
        this._validator.validateLoginUserPayload(payload);
        const userId = await this._userService.loginUser(payload, serverAuth);
        const accessToken = this._tokenManager.generateAccessToken({ id: userId });
        const refreshToken = this._tokenManager.generateRefreshToken({ id: userId });
        await this._userService.addUserAuth(
            {
                id: userId,
                access_token: accessToken,
                refresh_token: refreshToken,
                role: "user"
            },
            serverAuth
        );

        const response = {
            status: "success",
            message: "User successfully logged in",
            data: {
                user_id: userId,
                access_token: accessToken,
                refresh_token: refreshToken
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async editUserAuthHandler(request: Request, h: ResponseToolkit) {
        const serverAuth = request.headers.authorization;
        let accessToken: string;
        if (process.env.NODE_ENV === "production") {
            const payload = request.payload;
            const decryptedPayload = this._responseManager.decrypt(payload as string) as IAuthState;
            const decryptedRefreshToken = decryptedPayload.data;
            if (!decryptedRefreshToken) {
                throw new Error("Invalid refresh token");
            }
            const userId = this._tokenManager.verifyRefreshToken(
                decryptedRefreshToken.refresh_token
            );
            accessToken = this._tokenManager.generateAccessToken({ id: userId });
            await this._userService.editUserAuth(
                accessToken,
                decryptedRefreshToken.refresh_token,
                serverAuth
            );
        } else {
            const payload = request.payload as IAuth;
            const userId = this._tokenManager.verifyRefreshToken(payload.refresh_token);
            accessToken = this._tokenManager.generateAccessToken({ id: userId });
            await this._userService.editUserAuth(accessToken, payload.refresh_token, serverAuth);
        }

        const response = {
            status: "success",
            message: "User successfully edited",
            data: {
                access_token: accessToken
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async logoutUserHandler(request: Request, h: ResponseToolkit) {
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
        await this._userService.logoutUser(refreshToken, serverAuth);

        const response = {
            status: "success",
            message: "User successfully logged out"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }
    // End User Auth Handler
}

export default UserHandler;
