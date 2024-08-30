-- Create table trial
CREATE TABLE IF NOT EXISTS trials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID DEFAULT NULL,
    free_trial BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- create index to table trial
CREATE INDEX IF NOT EXISTS trial_user_id_index ON trials USING HASH (user_id);
CREATE INDEX IF NOT EXISTS trial_free_trial_index ON trials USING HASH (free_trial);