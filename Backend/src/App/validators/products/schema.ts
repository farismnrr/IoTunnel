import Joi from "joi";

const AddProductPayloadSchema = Joi.object({
    product_name: Joi.string().required().error(new Error("Product name is required")),
    description: Joi.string().required().error(new Error("Description is required")),
    price: Joi.string().required().error(new Error("Price is required")),
    duration: Joi.string().required().error(new Error("Duration is required")),
    tags: Joi.string().optional().allow(null, "")
});

const EditProductPayloadSchema = Joi.object({
    product_name: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.string().optional(),
    duration: Joi.string().optional(),
    tags: Joi.string().optional().allow(null, "")
});

export { AddProductPayloadSchema, EditProductPayloadSchema };
