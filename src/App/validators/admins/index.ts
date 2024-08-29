import type { IAdmin, IAdminWithNewPassword, IAuth } from "../../../Common/models/types";
import { InvariantError } from "../../../Common/errors";
import {
	RegisterAdminPayloadSchema,
	LoginAdminPayloadSchema,
	EditAdminPayloadSchema,
	ChangePasswordPayloadSchema,
	SendOtpPayloadSchema,
	AdminAuthPayloadSchema
} from "./schema";

const AdminValidator = {
	validateAdminPayload: (payload: IAdmin) => {
		const validationResult = RegisterAdminPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateLoginAdminPayload: (payload: IAdmin) => {
		const validationResult = LoginAdminPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateEditAdminPayload: (payload: IAdmin) => {
		const validationResult = EditAdminPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateChangePasswordPayload: (payload: IAdminWithNewPassword) => {
		const validationResult = ChangePasswordPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateSendOtpPayload: (payload: IAdmin) => {
		const validationResult = SendOtpPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateAdminAuthPayload: (payload: IAuth) => {
		const validationResult = AdminAuthPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	}
};

export default AdminValidator;
