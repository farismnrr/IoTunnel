-- Create table items_digital
CREATE TABLE IF NOT EXISTS components (
    id VARCHAR(30) PRIMARY KEY,
    item_id VARCHAR(30) NOT NULL,
    topic_id VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id),
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);

-- Create Index to improve query performance
CREATE INDEX IF NOT EXISTS idx_item_id ON components USING HASH (item_id);
CREATE INDEX IF NOT EXISTS idx_topic_id ON components USING HASH (topic_id);