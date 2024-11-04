import Joi from "joi";

const ItemPayloadSchema = Joi.object({
    name: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .required()
        .error(new Error("Name is required")),
    pin_type: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .required()
        .error(new Error("Pin type is required"))
});

export { ItemPayloadSchema };
