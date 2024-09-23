import type { IItem } from "../../../Common/models/types";
import { InvariantError } from "../../../Common/errors";
import { ItemPayloadSchema } from "./schema";

const ItemValidator = {
    validateItemPayload: (payload: IItem) => {
        const validationResult = ItemPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
};

export default ItemValidator;
