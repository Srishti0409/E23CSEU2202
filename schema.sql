-- Stage 2: Database Schema Design
-- Roll Number: E23CSEU2202

CREATE TABLE students (
    student_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL, -- e.g., 'Result', 'Placement', 'Event'
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Mapping table for many-to-many relationship
CREATE TABLE student_notifications (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) REFERENCES students(student_id),
    notification_id INT REFERENCES notifications(notification_id),
    is_read BOOLEAN DEFAULT FALSE,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_student_unread ON student_notifications (student_id, is_read);