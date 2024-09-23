-- Create table items
CREATE TABLE IF NOT EXISTS items (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pin_type VARCHAR(10) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Index to improve query performance
CREATE INDEX IF NOT EXISTS idx_pin_type ON items USING HASH (pin_type);
