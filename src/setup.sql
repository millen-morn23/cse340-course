-- =========================
-- ORGANIZATIONS
-- =========================
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  image VARCHAR(255),
  contact_email VARCHAR(100)
);

INSERT INTO organizations (name, description, image, contact_email)
VALUES
('Red Cross', 'Emergency assistance and disaster relief.', '/images/redcross.jpg', 'contact@redcross.org'),
('UNICEF', 'Children welfare and support.', '/images/unicef.jpg', 'info@unicef.org'),
('WWF', 'Environmental conservation.', '/images/wwf.jpg', 'support@wwf.org');


-- =========================
-- PROJECTS
-- =========================
CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  location VARCHAR(100),
  project_date DATE,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

INSERT INTO projects (organization_id, title, description, location, project_date)
VALUES
(1, 'Food Drive', 'Collecting food for families', 'Nairobi', '2026-06-01'),
(1, 'Blood Donation', 'Community blood drive', 'Westlands', '2026-06-05'),
(1, 'Disaster Relief Training', 'Training volunteers for emergencies', 'Kasarani', '2026-06-10'),
(1, 'First Aid Workshop', 'Teaching basic first aid skills', 'Embakasi', '2026-06-15'),
(1, 'Emergency Response Drill', 'Simulated emergency response', 'Thika', '2026-06-20'),

(2, 'School Supplies Drive', 'Providing books and pens', 'Kibera', '2026-06-03'),
(2, 'Child Health Camp', 'Free medical services for children', 'Mathare', '2026-06-07'),
(2, 'Nutrition Program', 'Feeding program for children', 'Kayole', '2026-06-12'),
(2, 'Education Awareness', 'Promoting school attendance', 'Donholm', '2026-06-18'),
(2, 'Child Protection Workshop', 'Safety training for kids', 'Ruai', '2026-06-22'),

(3, 'Tree Planting', 'Planting trees for conservation', 'Ngong Hills', '2026-06-04'),
(3, 'Wildlife Awareness', 'Educating public on wildlife', 'Karen', '2026-06-08'),
(3, 'Clean-Up Campaign', 'Community clean-up exercise', 'CBD', '2026-06-13'),
(3, 'Recycling Program', 'Promoting recycling habits', 'Langata', '2026-06-17'),
(3, 'Forest Restoration', 'Restoring degraded forest land', 'Kiambu', '2026-06-25');


-- =========================
-- CATEGORIES
-- =========================
CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

INSERT INTO categories (name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');


-- =========================
-- PROJECT ↔ CATEGORY RELATIONSHIP
-- =========================
CREATE TABLE project_categories (
  project_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (project_id, category_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

INSERT INTO project_categories (project_id, category_id)
VALUES
(11, 1), (12, 1), (13, 1), (14, 1), (15, 1),
(6, 2), (9, 2), (10, 2),
(1, 3), (6, 3), (11, 3),
(2, 4), (7, 4), (8, 4);


-- =========================
-- ROLES
-- =========================
CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL,
  role_description TEXT
);

INSERT INTO roles (role_name, role_description)
VALUES
('user', 'Standard user with basic access'),
('admin', 'Administrator with full system access');


-- =========================
-- USERS
-- =========================
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INTEGER REFERENCES roles(role_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Volunteers table
CREATE TABLE project_volunteers (

  volunteer_id SERIAL PRIMARY KEY,

  user_id INT NOT NULL,

  project_id INT NOT NULL,

  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_project
    FOREIGN KEY (project_id)
    REFERENCES projects(project_id)
    ON DELETE CASCADE,

  CONSTRAINT unique_volunteer
    UNIQUE (user_id, project_id)
);