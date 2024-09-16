import Joi from "joi";

const UploadAdminFilePayloadSchema = Joi.object({
	"content-type": Joi.string()
		.valid("image/jpeg", "image/png", "image/webp", "image/jpg")
		.required()
		.insensitive()
	// .error(new Error("File must be a valid image file of type JPEG, PNG, WEBP, or JPG"))
}).unknown(true);

const UploadUserFilePayloadSchema = Joi.object({
	"content-type": Joi.string()
		.valid("image/jpeg", "image/png", "image/webp", "image/jpg")
		.required()
		.insensitive()
		.error(new Error("File must be a valid image file of type JPEG, PNG, WEBP, or JPG"))
}).unknown(true);

export { UploadAdminFilePayloadSchema, UploadUserFilePayloadSchema };
