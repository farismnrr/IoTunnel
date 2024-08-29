import Joi from "joi";

const RegisterAdminPayloadSchema = Joi.object({
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
	otp_code: Joi.string()
		.length(6)
		.pattern(/^[0-9]+$/)
		.required()
});

const EditAdminPayloadSchema = Joi.object({
	first_name: Joi.string().min(3).max(30).pattern(new RegExp("^[a-zA-Z ]+$")),
	last_name: Joi.string().min(3).max(30).pattern(new RegExp("^[a-zA-Z ]+$")),
	email: Joi.string().email(),
	password: Joi.string()
		.min(8)
		.max(128)
		.required()
		.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$"))
});

const LoginAdminPayloadSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required()
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

const AdminAuthPayloadSchema = Joi.object({
	refresh_token: Joi.string()
		.required()
		.trim()
		.regex(/^[a-zA-Z0-9._\-+=]{1,}\.[a-zA-Z0-9._\-+=]{1,}\.[a-zA-Z0-9._\-+=]{1,}$/)
});

export {
	RegisterAdminPayloadSchema,
	LoginAdminPayloadSchema,
	EditAdminPayloadSchema,
	ChangePasswordPayloadSchema,
	SendOtpPayloadSchema,
	AdminAuthPayloadSchema
};
