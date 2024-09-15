import Joi from "joi";

const LoginUserPayloadSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required()
});

const RegisterUserPayloadSchema = Joi.object({
	first_name: Joi.string().min(3).max(30).required().pattern(new RegExp("^[a-zA-Z ]+$")),
	last_name: Joi.string().min(3).max(30).required().pattern(new RegExp("^[a-zA-Z ]+$")),
	password: Joi.string()
		.min(8)
		.max(128)
		.required()
		.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$")),
	retype_password: Joi.string()
		.min(8)
		.max(128)
		.required()
		.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$")),
	email: Joi.string().email().required(),
	phone_number: Joi.string().required(),
	otp_code: Joi.string()
		.length(6)
		.pattern(/^[0-9]+$/)
});

const EditUserPayloadSchema = Joi.object({
	first_name: Joi.string().min(3).max(30).optional().pattern(new RegExp("^[a-zA-Z ]+$")),
	last_name: Joi.string().min(3).max(30).optional().pattern(new RegExp("^[a-zA-Z ]+$")),
	email: Joi.string().email().optional(),
	phone_number: Joi.string().optional(),
	password: Joi.string()
		.min(8)
		.max(128)
		.required()
		.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$"))
});

const ChangePasswordPayloadSchema = Joi.object({
	email: Joi.string().email().required(),
	new_password: Joi.string()
		.min(8)
		.max(128)
		.required()
		.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$")),
	retype_password: Joi.string()
		.min(8)
		.max(128)
		.required()
		.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$")),
	otp_code: Joi.string()
		.length(6)
		.pattern(/^[0-9]+$/)
		.required()
});

const SendOtpPayloadSchema = Joi.object({
	email: Joi.string().email().required()
});

const UserAuthPayloadSchema = Joi.object({
	refresh_token: Joi.string()
		.required()
		.trim()
		.regex(/^[a-zA-Z0-9._\-+=]{1,}\.[a-zA-Z0-9._\-+=]{1,}\.[a-zA-Z0-9._\-+=]{1,}$/)
});

export {
	RegisterUserPayloadSchema,
	EditUserPayloadSchema,
	LoginUserPayloadSchema,
	ChangePasswordPayloadSchema,
	SendOtpPayloadSchema,
	UserAuthPayloadSchema
};
