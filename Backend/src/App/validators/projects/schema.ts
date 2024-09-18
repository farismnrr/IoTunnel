import Joi from "joi";

const addProjectSchema = Joi.object({
	name: Joi.string()
		.max(50)
		.regex(/^[^<>{}[\]]*$/)
		.required()
		.error(new Error("Name harus berupa teks tanpa karakter khusus")),
	description: Joi.string()
		.regex(/^[^<>{}[\]]*$/)
		.required()
		.error(new Error("Deskripsi harus berupa teks tanpa karakter khusus"))
});

const updateProjectSchema = Joi.object({
	name: Joi.string()
		.max(50)
		.regex(/^[^<>{}[\]]*$/)
		.optional()
		.error(new Error("Name harus berupa teks tanpa karakter khusus")),
	description: Joi.string()
		.regex(/^[^<>{}[\]]*$/)
		.optional()
		.error(new Error("Deskripsi harus berupa teks tanpa karakter khusus"))
});

export { addProjectSchema, updateProjectSchema };
