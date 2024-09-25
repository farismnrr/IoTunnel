import type {
    FormattedSignupUser,
    SignupUser,
    FormattedSignupAdmin,
    SignupAdmin,
    FormattedSigninAdmin,
    SigninAdmin
} from "../types";

function formatSignupUser(user: FormattedSignupUser): SignupUser {
    return {
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        password: user.password,
        retype_password: user.retypePassword,
        otp_code: user.otpCode,
        phone_number: user.phoneNumber
    };
}

function formatSignupAdmin(admin: FormattedSignupAdmin): SignupAdmin {
    return {
        first_name: admin.firstName,
        last_name: admin.lastName,
        email: admin.email,
        password: admin.password,
        retype_password: admin.retypePassword,
        otp_code: admin.otpCode,
        key: admin.key
    };
}

function formatSigninAdmin(admin: FormattedSigninAdmin): SigninAdmin {
    return {
        email: admin.email,
        password: admin.password,
        otp_code: admin.otpCode
    };
}

export { formatSignupUser, formatSignupAdmin, formatSigninAdmin };
