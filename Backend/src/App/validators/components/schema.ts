import Joi from "joi";

const ComponentPayloadSchema = Joi.object({
	name: Joi.string().required(),
	item_name: Joi.string().required()
});

export { ComponentPayloadSchema };
