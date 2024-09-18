import type { ServerRoute } from "@hapi/hapi";
import UserHandler from "./handler";

const routes: (handler: UserHandler) => ServerRoute[] = handler => [
	// Start OTP Routes
	{
		method: "POST",
		path: "/users/otp/register",
		handler: handler.sendOtpMailHandler
	},
	{
		method: "POST",
		path: "/users/otp/reset",
		handler: handler.sendOtpResetPasswordHandler
	},
	// End OTP Routes

	// Start User Routes
	{
		method: "POST",
		path: "/users",
		handler: handler.registerUserHandler
	},
	{
		method: "POST",
		path: "/users/login",
		handler: handler.loginUserHandler
	},
	{
		method: "GET",
		path: "/users",
		handler: handler.getUserByIdHandler,
		options: {
			auth: "user_jwt"
		}
	},
	{
		method: "PATCH",
		path: "/users/reset",
		handler: handler.changePasswordHandler
	},
	{
		method: "PUT",
		path: "/users",
		handler: handler.editUserHandler,
		options: {
			auth: "user_jwt"
		}
	},
	{
		method: "DELETE",
		path: "/users",
		handler: handler.deleteUserByIdHandler,
		options: {
			auth: "user_jwt"
		}
	},
	// {
	// 	method: "DELETE",
	// 	path: "/users/all",
	// 	handler: handler.deleteAllUsersHandler
	// },
	// End User Routes

	// Start User Auth Routes
	{
		method: "PUT",
		path: "/users/auth",
		handler: handler.editUserAuthHandler
	},
	{
		method: "DELETE",
		path: "/users/auth",
		handler: handler.logoutUserHandler
	}
	// End User Auth Routes
];

export default routes;
