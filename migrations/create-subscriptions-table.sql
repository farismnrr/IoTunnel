-- Create table subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id VARCHAR(30) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
    trial_id VARCHAR(30) REFERENCES trials(id) ON DELETE CASCADE ON UPDATE CASCADE,
    api_key VARCHAR(255) NOT NULL,
    subscription_start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subscription_end_date TIMESTAMP NOT NULL
);

-- Index to improve query performance
CREATE INDEX IF NOT EXISTS idx_user_id ON subscriptions USING HASH (user_id);
CREATE INDEX IF NOT EXISTS idx_trial_id ON subscriptions USING HASH (trial_id);
CREATE INDEX IF NOT EXISTS idx_product_id ON subscriptions USING HASH (product_id);
CREATE INDEX IF NOT EXISTS idx_subscription_end_date ON subscriptions USING BTREE (subscription_end_date);

