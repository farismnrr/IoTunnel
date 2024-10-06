import type { Request, ResponseToolkit } from "@hapi/hapi";
import type { IItem, IAuth } from "../../../Common/models/types";
import autoBind from "auto-bind";
import ItemService from "../../../App/services/mqtt/item.service";
import ItemValidator from "../../../App/validators/items";
import ResponseManager from "../../../Common/manager/manager.response";

class ItemHandler {
    private readonly _itemService: ItemService;
    private readonly _validator: typeof ItemValidator;
    private readonly _responseManager: typeof ResponseManager;

    constructor(
        itemService: ItemService,
        validator: typeof ItemValidator,
        responseManager: typeof ResponseManager
    ) {
        this._itemService = itemService;
        this._validator = validator;
        this._responseManager = responseManager;
        autoBind(this);
    }

    async createItemHandler(request: Request, h: ResponseToolkit) {
        const payload = request.payload as IItem;
        const admin = request.auth.credentials as unknown as IAuth;
        this._validator.validateItemPayload(payload);
        const item = await this._itemService.createItem(payload, admin.id);
        const response = {
            status: "success",
            message: "Item created successfully",
            data: {
                item_id: item
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(201);
    }

    async getItemsHandler(request: Request, h: ResponseToolkit) {
        const serverKey = request.headers.authorization;
        const items = await this._itemService.getItems(serverKey);
        const response = {
            status: "success",
            data: {
                items
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async getItemByIdHandler(request: Request, h: ResponseToolkit) {
        const { id } = request.params;
        const serverKey = request.headers.authorization;
        const item = await this._itemService.getItemById(serverKey, id);
        const response = {
            status: "success",
            data: {
                item
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async updateItemHandler(request: Request, h: ResponseToolkit) {
        const { id } = request.params;
        const payload = request.payload as IItem;
        const admin = request.auth.credentials as unknown as IAuth;
        this._validator.validateItemPayload(payload);
        await this._itemService.updateItem(id, payload, admin.id);
        const response = {
            status: "success",
            message: "Item updated successfully"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async deleteItemHandler(request: Request, h: ResponseToolkit) {
        const { id } = request.params;
        const admin = request.auth.credentials as unknown as IAuth;
        await this._itemService.deleteItem(id, admin.id);
        const response = {
            status: "success",
            message: "Item deleted successfully"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }
}

export default ItemHandler;
