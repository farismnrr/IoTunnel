-- Create table trial
CREATE TABLE IF NOT EXISTS trials (
    email VARCHAR(255) NOT NULL,
    free_trial BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- create index to table trial
CREATE INDEX IF NOT EXISTS trial_email_index ON trials USING HASH (email);
CREATE INDEX IF NOT EXISTS trial_free_trial_index ON trials USING HASH (free_trial);