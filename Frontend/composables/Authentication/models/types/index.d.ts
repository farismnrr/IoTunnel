// Signup types
interface BaseSignup {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    retype_password: string;
    otp_code: string;
}

interface SignupUser extends BaseSignup {
    phone_number: string;
}

interface FormattedBaseSignup {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    retypePassword: string;
    otpCode: string;
}

interface FormattedSignupUser extends FormattedBaseSignup {
    phoneNumber: string;
}

interface SignupAdmin extends BaseSignup {
    admin_key: string;
}

interface FormattedSignupAdmin extends FormattedBaseSignup {
    adminKey: string;
}

interface BaseResponseSignup {
    status: string;
    message: string;
}

interface SignupDataUser {
    freeTrial: boolean;
}

interface SignupDataAdmin {}

interface UserSignupData extends SignupDataUser {
    userId: string;
}

interface AdminSignupData extends SignupDataAdmin {
    adminId: string;
}

interface ResponseSignupUser extends BaseResponseSignup {
    errors?: string;
    data?: UserSignupData;
}

interface ResponseSignupAdmin extends BaseResponseSignup {
    errors?: string;
    data?: AdminSignupData;
}

// Signin types
interface BaseSignin {
    email: string;
    password: string;
}

interface SigninUser extends BaseSignin {}

interface SigninAdmin extends BaseSignin {
    otp_code: string;
}

interface FormattedSigninAdmin extends BaseSignin {
    otpCode: string;
}

interface BaseResponseSignin {
    status: string;
    message: string;
}

interface SigninData {
    access_token: string;
}

interface UserSigninData extends SigninData {
    userId: string;
}

interface AdminSigninData extends SigninData {
    adminId: string;
}

interface ResponseSigninUser extends BaseResponseSignin {
    errors?: string;
    data?: UserSigninData;
}

interface ResponseSigninAdmin extends BaseResponseSignin {
    errors?: string;
    data?: AdminSigninData;
}

export type {
    FormattedSignupUser,
    FormattedSignupAdmin,
    SignupUser,
    SignupAdmin,
    ResponseSignupUser,
    ResponseSignupAdmin,
    SigninUser,
    SigninAdmin,
    ResponseSigninUser,
    ResponseSigninAdmin,
    FormattedSigninAdmin
};
