import { RenameKeys } from "../../utils/types.utils";

interface IUser {
	id: string;
	first_name: string;
	last_name: string;
	password: string;
	retype_password: string;
	email: string;
	phone_number: string;
	photo: string;
}

interface IUserWithOtp extends IUser {
	otp_code: number;
}

type IUserWithNewPassword = RenameKeys<IUserWithOtp, "password", "new_password">;

export type { IUser, IUserWithOtp, IUserWithNewPassword };
