-- Create table items_digital
CREATE TABLE IF NOT EXISTS components (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    item_id VARCHAR(30) NOT NULL,
    topic_id VARCHAR(30) NOT NULL,
    user_id VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id),
    FOREIGN KEY (topic_id) REFERENCES topics(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create Index to improve query performance
CREATE INDEX IF NOT EXISTS idx_item_id ON components USING HASH (item_id);
CREATE INDEX IF NOT EXISTS idx_topic_id ON components USING HASH (topic_id);
CREATE INDEX IF NOT EXISTS idx_user_id ON components USING HASH (user_id);