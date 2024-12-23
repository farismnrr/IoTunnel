import type { IProject } from "../../../Common/models/types";
import ProjectRepository from "../../../Infrastructure/repositories/server/mqtt/project.repo";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";
import SubscriptionRepository from "../../../Infrastructure/repositories/server/postgres/subscription.repo";
import { nanoid } from "nanoid";
import {
    NotFoundError,
    AuthorizationError,
    InvariantError,
    AuthenticationError
} from "../../../Common/errors";

class ProjectService {
    private readonly _projectRepository: ProjectRepository;
    private readonly _authRepository: AuthRepository;
    private readonly _userRepository: UserRepository;
    private readonly _subscriptionRepository: SubscriptionRepository;

    constructor(
        projectRepository: ProjectRepository,
        authRepository: AuthRepository,
        userRepository: UserRepository,
        subscriptionRepository: SubscriptionRepository
    ) {
        this._projectRepository = projectRepository;
        this._authRepository = authRepository;
        this._userRepository = userRepository;
        this._subscriptionRepository = subscriptionRepository;
    }

    // Start Project Service
    async validateAddProjectPayload(payload: IProject): Promise<void> {
        if (!payload.name) {
            throw new InvariantError("Name is required");
        }
        if (!payload.description) {
            throw new InvariantError("Description is required");
        }
        if (!payload.deviceType) {
            throw new InvariantError("Device type is required");
        }
    }

    async addProject(userId: string, payload: IProject): Promise<string> {
        const userRole = await this._authRepository.getUserRole(userId);
        if (userRole !== "user") {
            throw new AuthorizationError("You are not authorized to add project");
        }
        const user = await this._userRepository.getUserById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const id = `project-${nanoid(16)}`;
        const subscription = await this._subscriptionRepository.getSubscriptionByUserId(userId);
        if (!subscription) {
            throw new NotFoundError("Subscription not found");
        }
        await this._projectRepository.addProject(id, userId, payload);
        return id;
    }

    async getProjectByUserId(userId: string): Promise<IProject[]> {
        const subscription = await this._subscriptionRepository.getSubscriptionByUserId(userId);
        if (!subscription) {
            throw new NotFoundError("Subscription not found");
        }
        const userRole = await this._authRepository.getUserRole(userId);
        if (userRole !== "user") {
            throw new AuthorizationError("You are not authorized to get projects");
        }
        const user = await this._userRepository.getUserById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const projects = await this._projectRepository.getProjectsByUserId(userId);
        return projects;
    }

    async getProjectById(id: string, userId: string): Promise<IProject> {
        const userRole = await this._authRepository.getUserRole(userId);
        if (userRole !== "user") {
            throw new AuthorizationError("You are not authorized to get project");
        }
        const user = await this._userRepository.getUserById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const project = await this._projectRepository.getProjectById(id);
        if (!project) {
            throw new NotFoundError("Project not found");
        }
        if (project.user_id !== userId) {
            throw new AuthorizationError("You are not allowed to access this project");
        }
        return project;
    }

    async updateProject(id: string, userId: string, payload: IProject): Promise<void> {
        if (!payload || Object.keys(payload).length === 0) {
            throw new InvariantError("Payload is required");
        }
        const user = await this._userRepository.getUserById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const subscription = await this._subscriptionRepository.getSubscriptionByUserId(userId);
        if (!subscription) {
            throw new NotFoundError("Subscription not found");
        }
        const project = await this._projectRepository.getProjectById(id);
        if (!project) {
            throw new NotFoundError("Project not found");
        }
        if (project.user_id !== userId) {
            throw new AuthorizationError("You are not allowed to update this project");
        }
        await this._projectRepository.updateProject(id, payload);
    }

    async updateProjectIpAddress(apiKey: string, id: string, payload: IProject): Promise<void> {
        if (!apiKey) {
            throw new AuthenticationError("Api Key is required");
        }
        if (!payload.deviceIpAddress) {
            throw new InvariantError("Device IP address is required");
        }
        const subscription = await this._subscriptionRepository.getSubscriptionByApiKey(apiKey);
        if (!subscription) {
            throw new NotFoundError("Subscription not found");
        }
        const user = await this._userRepository.getUserById(subscription.user_id);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const project = await this._projectRepository.getProjectById(id);
        if (!project) {
            throw new NotFoundError("Project not found");
        }
        if (project.user_id !== user.id) {
            throw new AuthorizationError("You are not allowed to update this project");
        }
        await this._projectRepository.updateProjectIpAddress(id, payload);
    }

    async deleteProject(id: string, userId: string): Promise<void> {
        const user = await this._userRepository.getUserById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const project = await this._projectRepository.getProjectById(id);
        if (!project) {
            throw new NotFoundError("Project not found");
        }
        if (project.user_id !== userId) {
            throw new AuthorizationError("You are not allowed to delete this project");
        }
        await this._projectRepository.deleteProject(id);
    }
    // End Project Service
}

export default ProjectService;
