import Joi from "joi";

const AddProductPayloadSchema = Joi.object({
    product_name: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .required()
        .error(new Error("Product name is required")),
    description: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .required()
        .error(new Error("Description is required")),
    price: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .required()
        .error(new Error("Price is required")),
    duration: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .required()
        .error(new Error("Duration is required")),
    tags: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .optional()
        .allow(null, "")
});

const EditProductPayloadSchema = Joi.object({
    product_name: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .optional(),
    description: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .optional(),
    price: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .optional(),
    duration: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .optional(),
    tags: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .optional()
        .allow(null, "")
});

export { AddProductPayloadSchema, EditProductPayloadSchema };
