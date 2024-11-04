-- Create table projects
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    device_ip_address VARCHAR(45),
    user_id VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create index for query performance
CREATE INDEX IF NOT EXISTS idx_project_user_id ON projects USING HASH (user_id);
CREATE INDEX IF NOT EXISTS idx_project_name ON projects USING HASH (name);
CREATE INDEX IF NOT EXISTS idx_project_device_type ON projects USING HASH (device_type);
CREATE INDEX IF NOT EXISTS idx_project_device_ip_address ON projects USING HASH (device_ip_address);
