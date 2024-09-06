interface ITopic {
	id: string;
	subscription_id: string;
}

interface ITopicWithApiKey extends ITopic {
	api_key: string;
}

export type { ITopic, ITopicWithApiKey };
