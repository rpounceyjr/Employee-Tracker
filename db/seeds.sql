INSERT INTO department (name) VALUES ('Outer Heaven');
INSERT INTO department (name) VALUES ('Shadow Moses');
INSERT INTO role (title, salary, department_id) VALUES ('Boss', 100000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Commander', 80000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Weapons Expert', 60000, 2);
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Big', 'Boss', 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Kazuhira', 'Miller', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Revolver', 'Ocelot', 3, 1);
