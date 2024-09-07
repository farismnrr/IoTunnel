-- Create table topics
CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(30) PRIMARY KEY,
    subscription_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index to improve query performance
CREATE INDEX IF NOT EXISTS idx_subscription_id ON topics USING HASH (subscription_id);