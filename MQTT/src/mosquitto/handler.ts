import type { Request, ResponseToolkit } from "@hapi/hapi";
import MosquittoService from "./service";
import autoBind from "auto-bind";

class MosquittoHandler {
	private mosquittoService: MosquittoService;

	constructor(mosquittoService: MosquittoService) {
		this.mosquittoService = mosquittoService;
		autoBind(this);
	}

	async handle(event: Request, h: ResponseToolkit) {
		const apiKey = event.headers["x-api-key"];
		await this.mosquittoService.fetchData(apiKey);
		return {
			statusCode: 200,
			body: "Data fetched and processed successfully"
		};
	}
}

export default MosquittoHandler;
