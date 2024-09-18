import type { IProject } from "../../../Common/models/types";
import { InvariantError } from "../../../Common/errors";
import { addProjectSchema, updateProjectSchema } from "./schema";

const ProjectValidator = {
	validateProjectPayload: (payload: IProject) => {
		const validationResult = addProjectSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateUpdateProjectPayload: (payload: IProject) => {
		const validationResult = updateProjectSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	}
};

export default ProjectValidator;