import { UploadAdminFilePayloadSchema, UploadUserFilePayloadSchema } from "./schema";
import { InvariantError } from "../../../Common/errors";

const StorageValidator = {
	validateUploadAdminFilePayload: (payload: Express.Multer.File) => {
		const validationResult = UploadAdminFilePayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateUploadUserFilePayload: (payload: Express.Multer.File) => {
		const validationResult = UploadUserFilePayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	}
};

export default StorageValidator;
