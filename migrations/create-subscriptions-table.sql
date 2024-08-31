-- Create table subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(30) PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id VARCHAR(30) NOT NULL REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
    subscription_start_date TIMESTAMP NOT NULL,
    subscription_end_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index to improve query performance
CREATE INDEX IF NOT EXISTS idx_user_id ON subscriptions USING HASH (user_id);
CREATE INDEX IF NOT EXISTS idx_product_id ON subscriptions USING HASH (product_id);
CREATE INDEX IF NOT EXISTS idx_subscription_start_date ON subscriptions USING BTREE (subscription_start_date);
CREATE INDEX IF NOT EXISTS idx_subscription_end_date ON subscriptions USING BTREE (subscription_end_date);
