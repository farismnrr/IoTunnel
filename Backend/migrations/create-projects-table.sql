-- Create table projects
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    user_id VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create index for query performance
CREATE INDEX IF NOT EXISTS idx_project_user_id ON projects USING HASH (user_id);
CREATE INDEX IF NOT EXISTS idx_project_name ON projects USING HASH (name);