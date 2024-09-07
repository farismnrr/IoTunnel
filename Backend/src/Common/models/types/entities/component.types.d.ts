interface IComponent {
	id: string;
    name: string;
	item_id: string;
	topic_id: string;
    user_id: string;
}

interface IComponentPayload {
    id: string;
    name: string;
    item_name: string;
    api_key: string;
}

export type { IComponent, IComponentPayload };
