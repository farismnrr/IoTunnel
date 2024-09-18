import type { IItem } from "../../../Common/models/types";
import ItemRepository from "../../../Infrastructure/repositories/server/mqtt/item.repo";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import { nanoid } from "nanoid";
import { InvariantError, AuthorizationError, NotFoundError, AuthenticationError } from "../../../Common/errors";

class ItemService {
	private readonly _itemRepository: ItemRepository;
	private readonly _authRepository: AuthRepository;
	private readonly _serverKey: string;

	constructor(itemRepository: ItemRepository, authRepository: AuthRepository, serverKey: string) {
		this._itemRepository = itemRepository;
		this._authRepository = authRepository;
		this._serverKey = serverKey;
	}

	async createItem(item: IItem, adminId: string): Promise<string> {
		const adminRole = await this._authRepository.getAdminRole(adminId);
		if (adminRole !== "admin") {
			throw new AuthorizationError("You are not authorized to add this item");
		}

		const itemPrefix = ["digital", "analog"].includes(item.pin_type)
			? `item-${item.pin_type}`
			: "";
		const id = `${itemPrefix}-${nanoid(16)}`;

		const itemExists = await this._itemRepository.getItemByName(item.name);
		if (itemExists) {
			throw new InvariantError("Item already exists");
		}

		const newItem: IItem = {
			...item,
			id
		};

		return this._itemRepository.createItem(newItem);
	}

	async getItems(serverKey: string): Promise<IItem[]> {
		if (!serverKey) {
			throw new AuthenticationError("Unauthorized");
		}
		const apiKey = serverKey.split(" ")[1];
		if (apiKey !== this._serverKey) {
			throw new AuthorizationError("You are not authorized to get items");
		}
		return this._itemRepository.getItems();
	}

	async getItemById(serverKey: string, id: string): Promise<IItem> {
		if (!serverKey) {
			throw new AuthenticationError("Unauthorized");
		}
		const apiKey = serverKey.split(" ")[1];
		if (apiKey !== this._serverKey) {
			throw new AuthorizationError("You are not authorized to get items");
		}
		const item = await this._itemRepository.getItemById(id);
		if (!item) {
			throw new NotFoundError("Item not found");
		}
		return item;
	}

	async updateItem(id: string, item: IItem, adminId: string): Promise<void> {
		const adminRole = await this._authRepository.getAdminRole(adminId);
		if (adminRole !== "admin") {
			throw new AuthorizationError("You are not authorized to add this item");
		}

		const itemExists = await this._itemRepository.getItemById(id);
		if (!itemExists) {
			throw new NotFoundError("Item not found");
		}

		if (item.pin_type !== "analog" && item.pin_type !== "digital") {
			throw new InvariantError("Invalid item name");
		}
		return this._itemRepository.updateItem(id, item);
	}

	async deleteItem(id: string, adminId: string): Promise<void> {
		const adminRole = await this._authRepository.getAdminRole(adminId);
		if (adminRole !== "admin") {
			throw new AuthorizationError("You are not authorized to add this item");
		}
		const itemExists = await this._itemRepository.getItemById(id);
		if (!itemExists) {
			throw new NotFoundError("Item not found");
		}
		return this._itemRepository.deleteItem(id);
	}
}

export default ItemService;
