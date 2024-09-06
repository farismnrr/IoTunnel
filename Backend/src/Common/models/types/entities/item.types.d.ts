interface IItem {
	id: string;
	name: string;
	pin_type: string;
}

interface IItemDigital {
	id: string;
	item_id: string;
	topic_id: string;
}

interface IItemAnalog {
	id: string;
	item_id: string;
	topic_id: string;
}

export type { IItem, IItemDigital, IItemAnalog };