import type { IProduct } from "../../../Common/models/types";
import InvariantError from "../../../Common/errors";
import { AddProductPayloadSchema, EditProductPayloadSchema } from "./schema";

const ProductValidator = {
    validateAddProductPayload: (payload: IProduct) => {
        const validationResult = AddProductPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateEditProductPayload: (payload: IProduct) => {
        const validationResult = EditProductPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
};

export default ProductValidator;
