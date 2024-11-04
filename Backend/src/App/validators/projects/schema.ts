import Joi from "joi";

const addProjectSchema = Joi.object({
    name: Joi.string()
        .max(50)
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .required()
        .error(new Error("Name must be text without special characters")),
    description: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .required()
        .error(new Error("Description must be text without special characters")),
    deviceType: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .required()
        .error(new Error("Device type is required"))
});

const updateProjectSchema = Joi.object({
    name: Joi.string()
        .max(50)
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .optional()
        .error(new Error("Name must be text without special characters")),
    description: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .optional()
        .error(new Error("Description must be text without special characters")),
    deviceType: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .optional()
        .error(new Error("Device type must be text")),
});

const updateProjectIpAddressSchema = Joi.object({
    deviceIpAddress: Joi.string()
        .regex(/^[^<>/;\\|`~{}[\]]*$/)
        .required()
        .error(new Error("Device IP address must be text"))
});

export { addProjectSchema, updateProjectSchema, updateProjectIpAddressSchema };
