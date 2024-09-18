import type { Request, ResponseToolkit } from "@hapi/hapi";
import type { IProject, IAuth } from "../../../Common/models/types";
import autoBind from "auto-bind";
import ProjectService from "../../../App/services/mqtt/project.service";
import ProjectValidator from "../../../App/validators/projects";

class ProjectHandler {
	private readonly _projectService: ProjectService;
	private readonly _validator: typeof ProjectValidator;

	constructor(projectService: ProjectService, validator: typeof ProjectValidator) {
		this._projectService = projectService;
		this._validator = validator;
		autoBind(this);
	}

	async addProjectHandler(request: Request, h: ResponseToolkit) {
		const { id } = request.auth.credentials as unknown as IAuth;
		const payload = request.payload as IProject;
		this._validator.validateProjectPayload(payload);
		const project = await this._projectService.addProject(id, payload);
		return h
			.response({
				status: "success",
				message: "Project added successfully",
				data: {
					project_id: project
				}
			})
			.code(201);
	}

	async getAllProjectHandler(request: Request, h: ResponseToolkit) {
		const { id } = request.auth.credentials as unknown as IAuth;
		const projects = await this._projectService.getProjects(id);
		return h
			.response({
				status: "success",
				data: {
					projects: projects
				}
			})
			.code(200);
	}

	async updateProjectHandler(request: Request, h: ResponseToolkit) {
		const { id } = request.auth.credentials as unknown as IAuth;
		const { projectId } = request.params;
		const payload = request.payload as IProject;
		this._validator.validateUpdateProjectPayload(payload);
		const project = await this._projectService.updateProject(id, payload, projectId);
		return h
			.response({
				status: "success",
				message: "Project updated successfully",
				data: {
					project_id: project
				}
			})
			.code(200);
	}

	async deleteProjectHandler(request: Request, h: ResponseToolkit) {
		const { id } = request.auth.credentials as unknown as IAuth;
		const { projectId } = request.params;
		await this._projectService.deleteProject(id, projectId);
		return h
			.response({
				status: "success",
				message: "Project deleted successfully"
			})
			.code(200);
	}
}

export default ProjectHandler;
