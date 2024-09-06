-- Create table subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL,
    product_id VARCHAR(30),
    trial_id VARCHAR(30),
    api_key VARCHAR(255) NOT NULL,
    subscription_start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subscription_end_date TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (trial_id) REFERENCES trials(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index to improve query performance
CREATE INDEX IF NOT EXISTS idx_user_id ON subscriptions USING HASH (user_id);
CREATE INDEX IF NOT EXISTS idx_trial_id ON subscriptions USING HASH (trial_id);
CREATE INDEX IF NOT EXISTS idx_product_id ON subscriptions USING HASH (product_id);
CREATE INDEX IF NOT EXISTS idx_subscription_end_date ON subscriptions USING BTREE (subscription_end_date);