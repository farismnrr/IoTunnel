import type { Request, ResponseToolkit } from "@hapi/hapi";
import type { IComponentPayload, IAuth } from "../../../Common/models/types";
import autoBind from "auto-bind";
import ComponentService from "../../../App/services/mqtt/component.service";
import ComponentValidator from "../../../App/validators/components";
import ResponseManager from "../../../Common/manager/manager.response";

class ComponentHandler {
    private readonly _componentService: ComponentService;
    private readonly _validator: typeof ComponentValidator;
    private readonly _responseManager: typeof ResponseManager;

    constructor(
        componentService: ComponentService,
        validator: typeof ComponentValidator,
        responseManager: typeof ResponseManager
    ) {
        this._componentService = componentService;
        this._validator = validator;
        this._responseManager = responseManager;
        autoBind(this);
    }

    async createComponentHandler(request: Request, h: ResponseToolkit) {
        const { id } = request.auth.credentials as unknown as IAuth;
        const payload = request.payload as IComponentPayload;
        this._validator.validateComponentPayload(payload);
        const component = await this._componentService.createComponent(id, payload);
        const response = {
            status: "success",
            message: "Component created successfully",
            data: {
                component_id: component
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(201);
    }

    async getComponentByProjectIdHandler(request: Request, h: ResponseToolkit) {
        const { id } = request.auth.credentials as unknown as IAuth;
        const { projectId } = request.params;
        const components = await this._componentService.getComponentByProjectId(id, projectId);
        const response = {
            status: "success",
            message: "Component retrieved successfully",
            data: {
                components: components
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async getComponentByApiKeyHandler(request: Request, h: ResponseToolkit) {
        const { projectId, itemName } = request.params;
        const apiKey = request.query.apiKey as string;
        const components = await this._componentService.getComponentByApiKey(
            apiKey,
            projectId,
            itemName
        );
        const response = {
            status: "success",
            message: "Component retrieved successfully",
            data: components
        };
        return h.response(response).code(200);
    }

    async updateComponentHandler(request: Request, h: ResponseToolkit) {
        const { id } = request.auth.credentials as unknown as IAuth;
        const { componentId } = request.params;
        const payload = request.payload as IComponentPayload;
        this._validator.validateComponentPayload(payload);
        await this._componentService.updateComponent(componentId, id, payload);
        const response = {
            status: "success",
            message: "Component updated successfully"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async deleteComponentHandler(request: Request, h: ResponseToolkit) {
        const { id } = request.auth.credentials as unknown as IAuth;
        const { componentId } = request.params;
        const payload = request.payload as IComponentPayload;
        this._validator.validateDeleteComponentPayload(payload);
        await this._componentService.deleteComponent(componentId, id, payload);
        const response = {
            status: "success",
            message: "Component deleted successfully"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }
}

export default ComponentHandler;
