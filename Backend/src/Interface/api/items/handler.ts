import type { Request, ResponseToolkit } from "@hapi/hapi";
import type { IItem, IAuth } from "../../../Common/models/types";
import autoBind from "auto-bind";
import ItemService from "../../../App/services/mqtt/item.service";
import ItemValidator from "../../../App/validators/items";

class ItemHandler {
	private readonly _itemService: ItemService;
	private readonly _validator: typeof ItemValidator;

	constructor(itemService: ItemService, validator: typeof ItemValidator) {
		this._itemService = itemService;
		this._validator = validator;
		autoBind(this);
	}

	async createItemHandler(request: Request, h: ResponseToolkit) {
		const payload = request.payload as IItem;
		const admin = request.auth.credentials as unknown as IAuth;
		this._validator.validateItemPayload(payload);
		const item = await this._itemService.createItem(payload, admin.id);
		return h
			.response({
				status: "success",
				message: "Item created successfully",
				data: {
					item_id: item
				}
			})
			.code(201);
	}

	async getItemsHandler(request: Request, h: ResponseToolkit) {
		const items = await this._itemService.getItems();
		return h.response({
			status: "success",
			data: {
				items
			}
		});
	}

	async getItemByIdHandler(request: Request, h: ResponseToolkit) {
		const { id } = request.params;
		const item = await this._itemService.getItemById(id);
		return h.response({
			status: "success",
			data: {
				item
			}
		});
	}

	async updateItemHandler(request: Request, h: ResponseToolkit) {
		const { id } = request.params;
		const payload = request.payload as IItem;
		const admin = request.auth.credentials as unknown as IAuth;
		this._validator.validateItemPayload(payload);
		await this._itemService.updateItem(id, payload, admin.id);

		return h.response({
			status: "success",
			message: "Item updated successfully"
		});
	}

	async deleteItemHandler(request: Request, h: ResponseToolkit) {
		const { id } = request.params;
		const admin = request.auth.credentials as unknown as IAuth;
		await this._itemService.deleteItem(id, admin.id);
		return h.response({
			status: "success",
			message: "Item deleted successfully"
		});
	}
}

export default ItemHandler;
