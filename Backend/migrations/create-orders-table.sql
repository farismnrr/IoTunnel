-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(30) PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id VARCHAR(30) NOT NULL REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
    status VARCHAR(255) NOT NULL,
    token VARCHAR(36) NOT NULL,
    payment_url TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index to improve query performance
CREATE INDEX IF NOT EXISTS idx_user_id ON orders USING HASH (user_id);
CREATE INDEX IF NOT EXISTS idx_product_id ON orders USING HASH (product_id);
CREATE INDEX IF NOT EXISTS idx_status ON orders USING HASH (status);