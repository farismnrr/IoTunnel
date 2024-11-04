-- Insert default admin
INSERT INTO admins (id, first_name, last_name, password, email, photo) VALUES
('admin-001', 'Super', 'Admin', '$2a$10$yJQbUq1jErn60OJ75fxRbuxtw5DjWGz9fRNmH54/mjd3s4kCzJ2be', 'venera4250@evasud.com', 'https://storage.googleapis.com/iotunnel-storage/default.jpg');

-- Insert sample users
INSERT INTO users (id, first_name, last_name, password, email, phone_number, photo) VALUES 
('user-001', 'Super', 'User', '$2a$10$yJQbUq1jErn60OJ75fxRbuxtw5DjWGz9fRNmH54/mjd3s4kCzJ2be', 'venera4250@evasud.com', '+6281234567890', 'https://storage.googleapis.com/iotunnel-storage/default.jpg');

-- Insert trial for sample user
INSERT INTO trials (id, email, free_trial) VALUES
('trial-001', 'venera4250@evasud.com', true);