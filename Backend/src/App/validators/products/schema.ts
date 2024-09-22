import Joi from "joi";

const AddProductPayloadSchema = Joi.object({
    product_name: Joi.string().required().error(new Error("Product name is required")),
    description: Joi.string().required().error(new Error("Description is required")),
    price: Joi.number().required().error(new Error("Price is required")),
    duration: Joi.string().required().error(new Error("Duration is required"))
});

const EditProductPayloadSchema = Joi.object({
    product_name: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().optional(),
    duration: Joi.string().optional()
});

export { AddProductPayloadSchema, EditProductPayloadSchema };
