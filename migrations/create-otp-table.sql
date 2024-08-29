-- Create table otp_codes
CREATE TABLE IF NOT EXISTS otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    otp_expires_at TIMESTAMP NOT NULL
);

-- Index for otp_expires_at to improve query performance
CREATE INDEX IF NOT EXISTS idx_otp_expires_at ON otp_codes USING BTREE (otp_expires_at);
CREATE INDEX IF NOT EXISTS idx_email ON otp_codes USING HASH (email);