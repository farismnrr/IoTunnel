import type { Request, ResponseToolkit } from "@hapi/hapi";
import type { IComponentPayload, IAuth } from "../../../Common/models/types";
import autoBind from "auto-bind";
import ComponentService from "../../../App/services/mqtt/component.service";
import ComponentValidator from "../../../App/validators/components";

class ComponentHandler {
	private readonly _componentService: ComponentService;
	private readonly _validator: typeof ComponentValidator;

	constructor(componentService: ComponentService, validator: typeof ComponentValidator) {
		this._componentService = componentService;
		this._validator = validator;
		autoBind(this);
	}

	async createComponentHandler(request: Request, h: ResponseToolkit) {
		const { id } = request.auth.credentials as unknown as IAuth;
		const payload = request.payload as IComponentPayload;
		this._validator.validateComponentPayload(payload);
		const component = await this._componentService.createComponent(id, payload);
		return h
			.response({
				status: "success",
				message: "Component created successfully",
				data: {
					component_id: component
				}
			})
			.code(201);
	}

	async getComponentByProjectIdHandler(request: Request, h: ResponseToolkit) {
		const { id } = request.auth.credentials as unknown as IAuth;
		const { projectId } = request.params;
		const components = await this._componentService.getComponentByProjectId(id, projectId);
		return h
			.response({
				status: "success",
				message: "Component retrieved successfully",
				data: {
					components: components
				}
			})
			.code(200);
	}

	async getComponentByApiKeyHandler(request: Request, h: ResponseToolkit) {
		const apiKey = request.headers.authorization;
		const { projectName, itemName } = request.params;
		const components = await this._componentService.getComponentByApiKey(
			apiKey,
			projectName,
			itemName
		);
		return h
			.response({
				status: "success",
				message: "Component retrieved successfully",
				data: {
					components: components
				}
			})
			.code(200);
	}

	async updateComponentHandler(request: Request, h: ResponseToolkit) {
		const apiKey = request.headers.authorization;
		const payload = request.payload as IComponentPayload;
		const { id } = request.params;
		this._validator.validateComponentPayload(payload);
		await this._componentService.updateComponent(id, payload, apiKey);
		return h
			.response({
				status: "success",
				message: "Component updated successfully"
			})
			.code(200);
	}

	async deleteComponentHandler(request: Request, h: ResponseToolkit) {
		const apiKey = request.headers.authorization;
		const { id } = request.params;
		await this._componentService.deleteComponent(id, apiKey);
		return h
			.response({
				status: "success",
				message: "Component deleted successfully"
			})
			.code(200);
	}
}

export default ComponentHandler;
