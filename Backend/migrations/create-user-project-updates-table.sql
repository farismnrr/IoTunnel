-- Create table user_project_updates
CREATE TABLE IF NOT EXISTS user_project_updates (
    id VARCHAR(30) PRIMARY KEY,
    project_id VARCHAR(30) NOT NULL,
    update_version VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    update_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create index for faster lookups
CREATE INDEX idx_user_project_updates_project_id ON user_project_updates(project_id);
CREATE INDEX idx_user_project_updates_status ON user_project_updates(status);
CREATE INDEX idx_user_project_updates_update_version ON user_project_updates(update_version);
