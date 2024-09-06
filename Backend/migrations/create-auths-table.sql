-- Create table auth
CREATE TABLE IF NOT EXISTS auths (
    user_id VARCHAR(30) DEFAULT NULL,
    admin_id VARCHAR(30) DEFAULT NULL,
    refresh_token TEXT NOT NULL,
    access_token TEXT NOT NULL,
    role VARCHAR(10) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index for user_id and admin_id to improve query performance
CREATE INDEX IF NOT EXISTS idx_user_id ON auths USING HASH (user_id);
CREATE INDEX IF NOT EXISTS idx_admin_id ON auths USING HASH (admin_id);