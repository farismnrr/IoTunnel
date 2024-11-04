import type { Request, ResponseToolkit } from "@hapi/hapi";
import type { IProject, IAuth } from "../../../Common/models/types";
import autoBind from "auto-bind";
import ProjectService from "../../../App/services/mqtt/project.service";
import ProjectValidator from "../../../App/validators/projects";
import ResponseManager from "../../../Common/manager/manager.response";

class ProjectHandler {
    private readonly _projectService: ProjectService;
    private readonly _validator: typeof ProjectValidator;
    private readonly _responseManager: typeof ResponseManager;

    constructor(
        projectService: ProjectService,
        validator: typeof ProjectValidator,
        responseManager: typeof ResponseManager
    ) {
        this._projectService = projectService;
        this._validator = validator;
        this._responseManager = responseManager;
        autoBind(this);
    }

    async addProjectHandler(request: Request, h: ResponseToolkit) {
        const { id } = request.auth.credentials as unknown as IAuth;
        const payload = request.payload as IProject;
        await this._projectService.validateAddProjectPayload(payload);
        this._validator.validateProjectPayload(payload);
        const project = await this._projectService.addProject(id, payload);
        const response = {
            status: "success",
            message: "Project added successfully",
            data: {
                project_id: project
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(201);
    }

    async getAllProjectHandler(request: Request, h: ResponseToolkit) {
        const { id } = request.auth.credentials as unknown as IAuth;
        const projects = await this._projectService.getProjectByUserId(id);
        const response = {
            status: "success",
            message: "Project fetched successfully",
            data: {
                projects: projects
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async getProjectsByIdHandler(request: Request, h: ResponseToolkit) {
        const { id } = request.auth.credentials as unknown as IAuth;
        const { projectId } = request.params;
        const project = await this._projectService.getProjectById(projectId, id);
        const response = {
            status: "success",
            message: "Project fetched successfully",
            data: {
                project: project
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async updateProjectHandler(request: Request, h: ResponseToolkit) {
        const { id } = request.auth.credentials as unknown as IAuth;
        const { projectId } = request.params;
        const payload = request.payload as IProject;
        this._validator.validateUpdateProjectPayload(payload);
        await this._projectService.updateProject(projectId, id, payload);
        const response = {
            status: "success",
            message: "Project updated successfully"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async updateProjectIpAddressHandler(request: Request, h: ResponseToolkit) {
        const apiKey = request.query.apiKey as string;
        const { projectId } = request.params;
        const payload = request.payload as IProject;
        this._validator.validateUpdateProjectIpAddressPayload(payload);
        await this._projectService.updateProjectIpAddress(apiKey, projectId, payload);
        const response = {
            status: "success",
            message: "Project IP address updated successfully"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async deleteProjectHandler(request: Request, h: ResponseToolkit) {
        const { id } = request.auth.credentials as unknown as IAuth;
        const { projectId } = request.params;
        await this._projectService.deleteProject(projectId, id);
        const response = {
            status: "success",
            message: "Project deleted successfully"
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }
}

export default ProjectHandler;
