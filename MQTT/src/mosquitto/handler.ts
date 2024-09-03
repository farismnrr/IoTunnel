import type { Request, ResponseToolkit } from "@hapi/hapi";
import MosquittoService from "./service";
import autoBind from "auto-bind";

class MosquittoHandler {
	private readonly _mosquittoService: MosquittoService;

	constructor(mosquittoService: MosquittoService) {
		this._mosquittoService = mosquittoService;
		autoBind(this);
	}

	async postPassword(request: Request, h: ResponseToolkit) {
		const apiKey = request.headers.authorization;
		await this._mosquittoService.postPassword(apiKey);
		return h
			.response({
				status: "success",
				message: "Password successfully posted.",
			})
			.code(201);
	}

	async deletePassword(request: Request, h: ResponseToolkit) {
		const userId = request.headers.authorization;
		await this._mosquittoService.deletePassword(userId);
		return h
			.response({
				status: "success",
				message: "Password successfully deleted.",
			})
			.code(200);
	}
}

export default MosquittoHandler;
