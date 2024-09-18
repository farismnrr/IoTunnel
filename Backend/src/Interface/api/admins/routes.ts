import type { ServerRoute } from "@hapi/hapi";
import AdminHandler from "./handler";

const routes: (handler: AdminHandler) => ServerRoute[] = handler => [
	// Start OTP Routes
	{
		method: "POST",
		path: "/admins/otp/register",
		handler: handler.sendOtpMailHandler
	},
	{
		method: "POST",
		path: "/admins/otp/reset",
		handler: handler.sendOtpResetPasswordHandler
	},
	// End OTP Routes

	// Start Admin Routes
	{
		method: "POST",
		path: "/admins",
		handler: handler.registerAdminHandler
	},
	{
		method: "POST",
		path: "/admins/login",
		handler: handler.loginAdminHandler
	},
	{
		method: "PATCH",
		path: "/admins/reset",
		handler: handler.changePasswordHandler
	},
	{
		method: "PUT",
		path: "/admins",
		handler: handler.editAdminHandler,
		options: {
			auth: "admin_jwt"
		}
	},
	{
		method: "DELETE",
		path: "/admins",
		handler: handler.deleteAdminByIdHandler,
		options: {
			auth: "admin_jwt"
		}
	},
	// {
	// 	method: "DELETE",
	// 	path: "/admins/all",
	// 	handler: handler.deleteAllAdminsHandler,
	// },
	// End Admin Routes

	// Start Admin Auth Routes
	{
		method: "PUT",
		path: "/admins/auth",
		handler: handler.editAdminAuthHandler
	},
	{
		method: "DELETE",
		path: "/admins/auth",
		handler: handler.logoutAdminHandler
	},
	// End Admin Auth Routes

	// Start Admin Key Routes
	{
		method: "GET",
		path: "/admins/key",
		handler: handler.getAdminKeyHandler
	}
	// End Admin Key Routes
];

export default routes;
