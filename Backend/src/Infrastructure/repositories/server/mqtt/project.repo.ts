import { Pool } from "pg";
import type { IProject } from "../../../../Common/models/types";

class ProjectRepository {
	private readonly _pool: Pool;

	constructor() {
		this._pool = new Pool();
	}

	async addProject(project: IProject): Promise<void> {
		const createdAt = new Date();
		const projectQuery = {
			text: `
                INSERT INTO projects (id, name, description, created_at, updated_at) 
                VALUES ($1, $2, $3, $4, $4) 
            `,
			values: [project.id, project.name, project.description, createdAt]
		};
		await this._pool.query(projectQuery);
	}

	async getProjectById(id: string): Promise<IProject | null> {
		const projectQuery = {
			text: "SELECT id, name, description FROM projects WHERE id = $1",
			values: [id]
		};
		const projectResult = await this._pool.query(projectQuery);
		return projectResult.rows[0] || null;
	}

    async getProjectsByUserId(userId: string): Promise<IProject[]> {
        const projectQuery = {
            text: "SELECT id, name, description FROM projects WHERE user_id = $1",
            values: [userId]
        };
        const projectResult = await this._pool.query(projectQuery);
        return projectResult.rows;
    }
    
	async getProjectByName(name: string): Promise<IProject | null> {
		const projectQuery = {
			text: "SELECT id, name, description FROM projects WHERE name = $1",
			values: [name]
		};
		const projectResult = await this._pool.query(projectQuery);
		return projectResult.rows[0] || null;
	}

	async updateProject(id: string, project: IProject): Promise<void> {
		const updatedAt = new Date();
		const fields: string[] = [];
		const values: (string | number)[] = [];
		let index = 1;

		if (project.name) {
			fields.push(`name = $${index++}`);
			values.push(project.name);
		}
		if (project.description) {
			fields.push(`description = $${index++}`);
			values.push(project.description);
		}

		const updateProjectQuery = {
			text: `
                UPDATE projects 
                SET ${fields.join(", ")}, updated_at = $${index++} 
                WHERE id = $${index}
            `,
			values: [...values, updatedAt, id]
		};

		await this._pool.query(updateProjectQuery);
	}

	async deleteProject(id: string): Promise<void> {
		const deleteProjectQuery = {
			text: "DELETE FROM projects WHERE id = $1",
			values: [id]
		};
		await this._pool.query(deleteProjectQuery);
	}
}

export default ProjectRepository;
