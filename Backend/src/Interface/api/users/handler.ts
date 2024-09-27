import type { Request, ResponseToolkit } from "@hapi/hapi";
import type {
    IUser,
    IUserWithOtp,
    IUserWithNewPassword,
    IAuth
} from "../../../Common/models/types";
import autoBind from "auto-bind";
import UserService from "../../../App/services/server/user.service";
import ProductService from "../../../App/services/server/product.service";
import UserValidator from "../../../App/validators/users";
import TokenManager from "../../../Common/tokens/manager.token";

class UserHandler {
    private readonly _userService: UserService;
    private readonly _productService: ProductService;
    private readonly _validator: typeof UserValidator;
    private readonly _tokenManager: typeof TokenManager;
    constructor(
        userService: UserService,
        productService: ProductService,
        validator: typeof UserValidator,
        tokenManager: typeof TokenManager
    ) {
        this._userService = userService;
        this._productService = productService;
        this._validator = validator;
        this._tokenManager = tokenManager;
        autoBind(this);
    }

    // Start OTP Handler
    async sendOtpMailHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IUser;
        const serverAuth = request.headers.authorization;
        this._validator.validateSendOtpPayload(payload);
        const otpCode = await this._userService.sendOtpMail(payload.email, serverAuth);
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
        const payload = request.payload as IUser;
        const serverAuth = request.headers.authorization;
        this._validator.validateSendOtpPayload(payload);
        const otpCode = await this._userService.sendOtpResetPasswordMail(payload.email, serverAuth);
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

    // Start User Handler
    async registerUserHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IUserWithOtp;
        const serverAuth = request.headers.authorization;
        await this._userService.validateRegisterUserPayload(payload);
        this._validator.validateUserPayload(payload);
        const trial = await this._productService.addTrialByUserEmail(payload.email);
        const user = await this._userService.registerUser(payload, serverAuth);
        return h
            .response({
                status: "success",
                message: "User successfully registered",
                data: {
                    user_id: user,
                    free_trial: trial
                }
            })
            .code(201);
    }

    async getUserByIdHandler(request: Request, h: ResponseToolkit) {
        const user = request.auth.credentials as unknown as IAuth;
        const userData = await this._userService.getUserById(user.id);
        return h
            .response({
                status: "success",
                message: "User fetched successfully",
                data: userData
            })
            .code(200);
    }

    async editUserHandler(request: Request, h: ResponseToolkit) {
        const user = request.auth.credentials as unknown as IAuth;
        const payload = request.payload as IUser;
        await this._userService.validateEditUserPayload(payload);
        this._validator.validateEditUserPayload(payload);
        await this._userService.editUser(user.id, payload);
        return h
            .response({
                status: "success",
                message: "User successfully edited"
            })
            .code(200);
    }

    async changePasswordHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IUserWithNewPassword;
        const serverAuth = request.headers.authorization;
        this._validator.validateChangePasswordPayload(payload);
        await this._userService.resetPassword(payload, serverAuth);
        return h
            .response({
                status: "success",
                message: "Password successfully changed"
            })
            .code(200);
    }

    async deleteUserByIdHandler(request: Request, h: ResponseToolkit) {
        const user = request.auth.credentials as unknown as IAuth;
        await this._userService.deleteUserById(user.id);
        return h
            .response({
                status: "success",
                message: "User successfully deleted"
            })
            .code(200);
    }

    async deleteAllUsersHandler(request: Request, h: ResponseToolkit) {
        const apiKey = request.query.api_key;
        await this._userService.deleteAllUsers(apiKey);
        return h
            .response({
                status: "success",
                message: "All users successfully deleted"
            })
            .code(200);
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

        return h
            .response({
                status: "success",
                message: "User successfully logged in",
                data: {
                    user_id: userId,
                    access_token: accessToken,
                    refresh_token: refreshToken
                }
            })
            .code(200);
    }

    async editUserAuthHandler(request: Request, h: ResponseToolkit) {
        const serverAuth = request.headers.authorization;
        const payload = request.payload as IAuth;
        this._validator.validateUserAuthPayload(payload);
        const userId = this._tokenManager.verifyRefreshToken(payload.refresh_token);
        const accessToken = this._tokenManager.generateAccessToken({ id: userId });
        await this._userService.editUserAuth({ ...payload, access_token: accessToken }, serverAuth);
        return h
            .response({
                status: "success",
                message: "User successfully edited",
                data: {
                    access_token: accessToken
                }
            })
            .code(200);
    }

    async logoutUserHandler(request: Request, h: ResponseToolkit) {
        const serverAuth = request.headers.authorization;
        const payload = request.payload as IAuth;
        this._validator.validateUserAuthPayload(payload);
        this._tokenManager.verifyRefreshToken(payload.refresh_token);
        await this._userService.logoutUser(payload.refresh_token, serverAuth);

        return h
            .response({
                status: "success",
                message: "User successfully logged out"
            })
            .code(200);
    }
    // End User Auth Handler
}

export default UserHandler;
