-- Create table products
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(30) PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    duration VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);