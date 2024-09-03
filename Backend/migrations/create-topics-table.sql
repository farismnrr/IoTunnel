-- Create table topics
CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(30) PRIMARY KEY,
    api_key VARCHAR(255) NOT NULL REFERENCES subscriptions(api_key) ON DELETE CASCADE ON UPDATE CASCADE,
    topic VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index to improve query performance
CREATE INDEX IF NOT EXISTS idx_api_key ON topics USING HASH (api_key);