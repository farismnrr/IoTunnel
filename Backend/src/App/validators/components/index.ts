import type { IComponentPayload } from "../../../Common/models/types";
import { InvariantError } from "../../../Common/errors";
import { ComponentPayloadSchema, DeleteComponentPayloadSchema } from "./schema";

const ComponentValidator = {
    validateComponentPayload: (payload: IComponentPayload) => {
        const validationResult = ComponentPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateDeleteComponentPayload: (payload: IComponentPayload) => {
        const validationResult = DeleteComponentPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
};

export default ComponentValidator;
