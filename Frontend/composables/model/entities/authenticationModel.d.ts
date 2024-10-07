import { BaseResponse } from "./baseResponseModel";

interface UserRegistrationData {
    first_name: string;
    last_name: string;
    password: string;
    retype_password: string;
    email: string;
    phone_number: string;
    otp_code: string;
}

interface AdminRegistrationData {
    first_name: string;
    last_name: string;
    password: string;
    retype_password: string;
    email: string;
    otp_code: string;
    admin_key: string;
}

interface UserLoginData {
    email: string;
    password: string;
}

interface AdminLoginData {
    email: string;
    password: string;
    otp_code: string;
}

interface authenticationUserResponse {
    user_id: string;
}

interface authenticationAdminResponse {
    admin_id: string;
}

interface authenticationLoginResponse {
    access_token: string;
}

interface AuthenticationResponse extends BaseResponse {
    data: authenticationUserResponse | authenticationAdminResponse | authenticationLoginResponse;
}

export type { UserRegistrationData, AdminRegistrationData, UserLoginData, AdminLoginData, AuthenticationResponse };
