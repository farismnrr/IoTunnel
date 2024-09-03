import { RemoveKeys } from "../../utils/types.utils";

interface IAuth {
	id: string;
	role: string;
	access_token: string;
	refresh_token: string;
}

interface IOtpCode {
    id: string;
	admin_id: string;
	user_id: string;
	otp_code: number;
}

type IAuthToken = RemoveKeys<IAuth, "id" & "role">;

export type { IAuth, IOtpCode, IAuthToken };
