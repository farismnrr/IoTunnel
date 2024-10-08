import { RenameKeys } from "../../utils/types.utils";

interface IAdmin {
    id: string;
    first_name: string;
    last_name: string;
    password: string;
    retype_password: string;
    email: string;
    photo: string;
}

interface IAdminWithOtp extends IAdmin {
    otp_code: number;
    admin_key: string;
}

type IAdminWithNewPassword = RenameKeys<IAdminWithOtp, "password", "new_password">;

export type { IAdmin, IAdminWithOtp, IAdminWithNewPassword };
