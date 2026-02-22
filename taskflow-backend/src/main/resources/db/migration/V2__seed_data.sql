-- =========================
-- ADMIN
-- =========================
INSERT INTO employees (id, name, email, role, manager_id)
VALUES 
('00000000-0000-0000-0000-000000000000', 
 'Admin', 
 'admin@taskflow.com', 
 'ADMIN', 
 NULL);

-- =========================
-- MANAGERS
-- =========================
INSERT INTO employees (id, name, email, role, manager_id)
VALUES 
('11111111-1111-1111-1111-111111111111', 
 'Manager 1', 
 'manager1@taskflow.com', 
 'MANAGER', 
 '00000000-0000-0000-0000-000000000000'),

('22222222-2222-2222-2222-222222222222', 
 'Manager 2', 
 'manager2@taskflow.com', 
 'MANAGER', 
 '00000000-0000-0000-0000-000000000000');

-- =========================
-- EMPLOYEES
-- =========================
INSERT INTO employees (id, name, email, role, manager_id)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
 'Employee 1', 
 'emp1@taskflow.com', 
 'COLLABORATOR', 
 '11111111-1111-1111-1111-111111111111'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 
 'Employee 2', 
 'emp2@taskflow.com', 
 'COLLABORATOR', 
 '11111111-1111-1111-1111-111111111111'),

('cccccccc-cccc-cccc-cccc-cccccccccccc', 
 'Employee 3', 
 'emp3@taskflow.com', 
 'COLLABORATOR', 
 '22222222-2222-2222-2222-222222222222');
