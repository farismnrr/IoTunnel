import type { IProduct, ITrial } from "./entities/product.types";
import type { IAuth, IOtpCode, IAuthToken } from "./entities/auth.types";
import type { IUser, IUserWithOtp, IUserWithNewPassword } from "./entities/user.types";
import type { IAdmin, IAdminWithOtp, IAdminWithNewPassword } from "./entities/admin.types";

export type {
	IAuth,
	IAdmin,
	IOtpCode,
	IAdminWithNewPassword,
	IAdminWithOtp,
	IAuthToken,
	IUser,
	IUserWithOtp,
	IUserWithNewPassword,
	IProduct,
	ITrial
};
