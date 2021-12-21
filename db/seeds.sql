INSERT INTO departments(name)
VALUES
('Human Resources'),
('Sales'),
('GitHub Go'),
('HTML'),
('JavaScript'),
('Masters');

INSERT INTO roles (title, salary, department_id)
VALUES
('Boss', 180000, 1),
('Sales Lead', 80000, 2),
('HTML Writer', 80000, 4),
('HTML Classifier', 85000, 4),
('HTML Identifier', 90000, 4),
('Software Engineer', 100000, 3),
('Script Master', 105000, 5),
('Lead Engineer', 80000, 6);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Todd", "Smith", 1, NULL),
("Karen", "Jan", 2, 1),
("Simon", "Urie", 3, 1),
("Salem", "Clause",4, 6),
("George", "Tan", 5, 6),
("Tammi", "Boston", 8, NULL),
("Hannah", "Boston", 6, 6),
("Alejandra", "Mads", 7, 6);