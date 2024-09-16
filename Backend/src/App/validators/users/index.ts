import type { IUser, IUserWithNewPassword, IAuth } from "../../../Common/models/types";
import { InvariantError } from "../../../Common/errors";
import {
	SendOtpPayloadSchema,
	UserAuthPayloadSchema,
	EditUserPayloadSchema,
	LoginUserPayloadSchema,
	RegisterUserPayloadSchema,
	ChangePasswordPayloadSchema
} from "./schema";

const UserValidator = {
	validateUserPayload: (payload: IUser) => {
		const validationResult = RegisterUserPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateEditUserPayload: (payload: IUser) => {
		const validationResult = EditUserPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateLoginUserPayload: (payload: IUser) => {
		const validationResult = LoginUserPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateChangePasswordPayload: (payload: IUserWithNewPassword) => {
		const validationResult = ChangePasswordPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateSendOtpPayload: (payload: IUser) => {
		const validationResult = SendOtpPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateUserAuthPayload: (payload: IAuth) => {
		const validationResult = UserAuthPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	}
};

export default UserValidator;
