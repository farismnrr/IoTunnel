import Joi from "joi";

const AddProductPayloadSchema = Joi.object({
	product_name: Joi.string().required(),
	description: Joi.string().required(),
	price: Joi.number().required(),
	duration: Joi.string().required(),
});

const EditProductPayloadSchema = Joi.object({
	product_name: Joi.string().optional(),
	description: Joi.string().optional(),
	price: Joi.number().optional(),
	duration: Joi.string().optional(),
});

export { AddProductPayloadSchema, EditProductPayloadSchema };
