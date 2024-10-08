import type { IAdmin, IAdminWithNewPassword, IAdminWithOtp, IAuth } from "../../../Common/models/types";
import { InvariantError } from "../../../Common/errors";
import {
    SendOtpPayloadSchema,
    EditAdminPayloadSchema,
    LoginAdminPayloadSchema,
    RegisterAdminPayloadSchema,
    ChangePasswordPayloadSchema,
    AdminAuthPayloadSchema
} from "./schema";

const AdminValidator = {
    validateAdminPayload: (payload: IAdminWithOtp) => {
        const validationResult = RegisterAdminPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateLoginAdminPayload: (payload: IAdminWithOtp) => {
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
