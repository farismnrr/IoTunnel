import Joi from "joi";

const ComponentPayloadSchema = Joi.object({
	name: Joi.string().required().error(new Error("Name is required")),
	item_name: Joi.string().required().error(new Error("Item name is required"))
});

export { ComponentPayloadSchema };
