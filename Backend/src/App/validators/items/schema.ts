import Joi from "joi";

const ItemPayloadSchema = Joi.object({
    name: Joi.string().required(),
    pin_type: Joi.string().required(),
});

export { ItemPayloadSchema };