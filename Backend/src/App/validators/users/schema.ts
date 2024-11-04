import Joi from "joi";

const LoginUserPayloadSchema = Joi.object({
    email: Joi.string().email().regex(/^[^<>/;\\|`~{}[\]]*$/).required().error(new Error("Email must be a valid email address")),
    password: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .required()
        .error(new Error("Password must be a valid password and must not contain special characters"))
});

const RegisterUserPayloadSchema = Joi.object({
    first_name: Joi.string()
        .min(3)
        .max(30)
        .required()
        .pattern(new RegExp("^[a-zA-Z ]+$"))
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .error(
            new Error(
                "First name must be at least 3 characters long and must not exceed 30 characters and must only contain letters and spaces"
            )
        ),
    last_name: Joi.string()
        .min(3)
        .max(30)
        .required()
        .pattern(new RegExp("^[a-zA-Z ]+$"))
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .error(
            new Error(
                "Last name must be at least 3 characters long and must not exceed 30 characters and must only contain letters and spaces"
            )
        ),
    password: Joi.string()
        .min(8)
        .max(128)
        .required()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$"))
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .error(
            new Error(
                "Password must be at least 8 characters long and must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
            )
        ),
    retype_password: Joi.string()
        .min(8)
        .max(128)
        .required()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$"))
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .error(new Error("Retype password must be same as password")),
    email: Joi.string().email().regex(/^[^<>/;\\|`~{}[\]]*$/).required().error(new Error("Email must be a valid email address")),
    phone_number: Joi.string()
        .required()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .error(new Error("Phone number must be a valid phone number")),
    otp_code: Joi.string()
        .required()
        .length(6)
        .pattern(/^[0-9]+$/)
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .error(new Error("OTP code must be a valid OTP code"))
});

const EditUserPayloadSchema = Joi.object({
    first_name: Joi.string()
        .min(3)
        .max(30)
        .optional()
        .pattern(new RegExp("^[a-zA-Z ]+$"))
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .error(
            new Error(
                "First name must be at least 3 characters long and must not exceed 30 characters and must only contain letters and spaces"
            )
        ),
    last_name: Joi.string()
        .min(3)
        .max(30)
        .optional()
        .pattern(new RegExp("^[a-zA-Z ]+$"))
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .error(
            new Error(
                "Last name must be at least 3 characters long and must not exceed 30 characters and must only contain letters and spaces"
            )
        ),
    email: Joi.string().email().regex(/^[^<>/;\\|`~{}[\]]*$/).optional().error(new Error("Email must be a valid email address")),
    phone_number: Joi.string()
        .optional()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .error(new Error("Phone number must be a valid phone number")),
    password: Joi.string()
        .required()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .error(new Error("Password must be a valid password"))
});

const ChangePasswordPayloadSchema = Joi.object({
    email: Joi.string().email().regex(/^[^<>/;\\|`~{}[\]]*$/).required().error(new Error("Email must be a valid email address")),
    new_password: Joi.string()
        .min(8)
        .max(128)
        .required()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$"))
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .error(
            new Error(
                "New password must be at least 8 characters long and must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
            )
        ),
    retype_password: Joi.string()
        .min(8)
        .max(128)
        .required()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$"))
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .error(new Error("Retype password must be same as new password")),
    otp_code: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .required()
        .error(new Error("OTP code must be a valid OTP code"))
});

const UserAuthPayloadSchema = Joi.object({
    refresh_token: Joi.string().regex(/^[^<>/;\\|`~{}[\]]*$/).required().error(new Error("Refresh token must be a valid refresh token"))
});

const SendOtpPayloadSchema = Joi.object({
    email: Joi.string().email().regex(/^[^<>/;\\|`~{}[\]]*$/).required().error(new Error("Email must be a valid email address"))
});

export {
    SendOtpPayloadSchema,
    EditUserPayloadSchema,
    LoginUserPayloadSchema,
    RegisterUserPayloadSchema,
    ChangePasswordPayloadSchema,
    UserAuthPayloadSchema
};
