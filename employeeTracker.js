var mysql = require("mysql");
var inquirer = require("inquirer");
// require('console.table');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "employee_trackerDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

function start() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "start",
                choices: ["Add an employee", "Add a role", "Add a department",
                    "View employees", "View roles", "View departments", "Update employee role",
                    "Update employee manager", "View employees by manager",
                    "Delete department", "Delete role", "Delete employee"]
            }
        ]).then(function (answer) {
            if (answer.start === "Add an employee") {
                addEmployee();
            } else if (answer.start === "Add a role") {
                addRole();
            } else if (answer.start === "Add a department") {
                console.log("Add a department");
                addDepartment();
            } else if (answer.start === "View employees") {
                viewEmployees()
            } else if (answer.start === "View roles") {
                viewRoles();
            } else if (answer.start === "View departments") {
                viewDepartment();
            } else if (answer.start === "Update employee role") {
                updateEmployeeRole();
            } else if (answer.start === "Update employee manager") {
                updateEmployeeManager();
            } else if (answer.start === "View employees by manager") {
                viewEmployeesByManager();
            } else if (answer.start === "Delete department") {
                deleteDepartment();
            } else if (answer.start === "Delete role") {
                deleteRole();
            } else {
                deleteEmployee();
            }
        })
}
//this one is good
function addDepartment() {
    inquirer
        .prompt([
            {
                name: "department",
                type: "input",
                message: "What department would you like to add?"
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.department
                },
                function (err) {
                    if (err) throw err;
                    console.log("Department added succesfully!");

                    start();
                }
            );
        })
}
//this one is good
function viewDepartment() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        const deptArray = [];
        for (let i = 0; i < res.length; i++) {
            deptArray.push(
                {
                    "Department ID": res[i].id,
                    Department: res[i].name
                }
            );
        }
        console.table(deptArray);

        start();
    })
}
//this one is good
function addRole() {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title of this role?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of this position?"

            },
            {
                name: "department",
                type: "input",
                message: "What is the ID of the department containing this role?"
            }
        ]).then(function (answer) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department
                },
                function (err) {
                    if (err) throw err;
                    console.log("Department added succesfully!");

                    start();
                }
            );
        })
}
//this one is good
function viewRoles() {
    connection.query("SELECT role.id AS role_id, salary, department.name AS department_name, title, department.id AS department_id FROM role LEFT JOIN department ON role.department_id = department.id ORDER BY role_id ASC", function (err, res) {
        if (err) throw err;
        const rolesArray = [];
        for (let i = 0; i < res.length; i++) {
            rolesArray.push(
                {
                    "Role ID": res[i].role_id,
                    Role: res[i].title,
                    Salary: res[i].salary,
                    "Department ID": res[i].department_id,
                    Department: res[i].department_name
                }
            );
        }
        console.table(rolesArray);
        start();
    })
}
//first_name, last_name, role_id, manager_id
function addEmployee() {
    inquirer
        .prompt([
            {
                name: "first",
                type: "input",
                message: "What is this employee's first name?"
            },
            {
                name: "last",
                type: "input",
                message: "What is this employee's last name?"
            },
            {
                name: "role",
                type: "input",
                message: "What is this employee's role ID?"
            },
            {
                name: "manager",
                type: "input",
                message: "What is the ID of this employee's manager?"
            },
        ])
        .then(function (answer) {
            if (answer.manager.trim() === "") {
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.first,
                        last_name: answer.last,
                        role_id: answer.role,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Employee added succesfully!");

                        start();
                    }
                );
            } else {
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.first,
                        last_name: answer.last,
                        role_id: answer.role,
                        manager_id: answer.manager
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Employee added succesfully!");

                        start();
                    }
                );
            }
        })

}
//this one is good
function viewEmployees() {
    connection.query("SELECT e.id AS employee_id, role.id AS role_id, e.first_name, e.last_name, role.title AS title, m.id AS manager_id, m.first_name AS manager_first, m.last_name AS manager_last FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN employee m on e.manager_id  = m.id ORDER BY e.id ASC", function (err, res) {
        if (err) throw err;
        const employeesArray = [];
        for (let i = 0; i < res.length; i++) {
            employeesArray.push(
                {
                    "Employee ID": res[i].employee_id,
                    Name: res[i].first_name + " " + res[i].last_name,
                    "Role ID": res[i].role_id,
                    Role: res[i].title,
                    "Manager ID": res[i].manager_id,
                    "Manager Name": res[i].manager_first + " " + res[i].manager_last
                }
            );
        }
        console.table(employeesArray);

        start();
    })
}

function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the employee ID of the employee whose role you would like to update?"
            },
            {
                name: "role",
                type: "input",
                message: "What is the role ID of the role to which you would like to update?"
            }
        ]).then((answer) => {
            // const names = answer.name.split(" ");
            connection.query("UPDATE employee SET role_id=? WHERE id=?",
                [
                    answer.role, answer.id,
                ],
                function (err) {
                    if (err) throw err;
                    console.log("Employee role updated!");

                    start();
                }
            );
        })

}
//this one is good
function deleteEmployee() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the employee ID of the employee you would like to delete?"
            }
        ]).then((answer) => {
            //need to figure out two WHERE constraints
            connection.query("DELETE FROM employee WHERE id=?",
                [
                    answer.id
                ],
                function (err) {
                    if (err) throw err;
                    console.log("Employee removed succesfully!");

                    start();
                }
            );
        })
}
//this one is good
function deleteRole() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the id of the role you would like to delete?"
            }
        ]).then((answer) => {
            connection.query("UPDATE employee SET role_id= NULL WHERE role_id=?",
                [
                    answer.id
                ], function (err) {
                    if (err) throw err;
                    console.log("Employees who previously held this role have had their information updated to reflect role removal.")
                })
            //need to figure out two WHERE constraints
            connection.query("DELETE FROM role WHERE id=?",
                [
                    answer.id
                ],
                function (err) {
                    if (err) throw err;
                    console.log("Role removed succesfully!");

                    start();
                }
            );
        })
}
function deleteDepartment() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the ID of the department you would like to delete?"
            }
        ]).then((answer) => {
            //need to figure out two WHERE constraints
            connection.query("UPDATE role SET department_id=NULL WHERE department_id=?",
                [
                    answer.id
                ],
                function (err) {
                    if (err) throw err;
                    console.log("Roles associated with this department have been updated to reflect department removal.")
                }
            );
            connection.query("DELETE FROM department WHERE id=?",
                [
                    answer.id
                ],
                function (err) {
                    if (err) throw err;
                    console.log("Department removed succesfully!");

                    start();
                }
            );
        })

}
//this one is good
function viewEmployeesByManager() {

    connection.query("SELECT m.id AS manager_id, m.first_name AS manager_first, m.last_name AS manager_last, e.id AS employee_id, e.first_name AS employee_first, e.last_name AS employee_last FROM employee m LEFT JOIN employee e ON m.id=e.manager_id ORDER BY manager_id ASC", (err, res) => {
        if (err) throw err;
        const managersArray = [];
        for (let i = 0; i < res.length; i++) {
            if (res[i].employee_id) {
                managersArray.push(
                    {
                        "Manager ID": res[i].manager_id,
                        Manager: res[i].manager_first + " " + res[i].manager_last,
                        "Employee ID": res[i].employee_id,
                        Employee: res[i].employee_first + " " + res[i].employee_last
                    }

                )
            }

        }
        console.table(managersArray);

        start();
    })
}
function updateEmployeeManager() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the employee ID of the employee whose manager you would like to update?"
            },
            {
                name: "manager_id",
                type: "input",
                message: "What is the ID of the manager to which you would like to update?"
            }
        ]).then((answer) => {
            //need to figure out two WHERE constraints
            connection.query("UPDATE employee SET manager_id=? WHERE id=?",
                [
                    answer.manager_id, answer.id
                ],
                function (err) {
                    if (err) throw err;
                    console.log("Employee manager updated!");

                    start();
                }
            );
        })
}
function showReferenceTable() {
    connection.query("SELECT department.id AS department_id, department.name AS department_name, e.id AS employee_id, role.id AS role_id, e.first_name, e.last_name, role.title AS title, m.id AS manager_id, m.first_name AS manager_first, m.last_name AS manager_last FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN employee m ON e.manager_id  = m.id LEFT JOIN department ON department.id=role.department_id ORDER BY e.id ASC", function (err, res) {
        if (err) throw err;
        const referenceTable = [];
        for (let i = 0; i < res.length; i++) {
            referenceTable.push(
                {
                    "Employee ID": res[i].employee_id,
                    Name: res[i].first_name + " " + res[i].last_name,
                    "Role ID": res[i].role_id,
                    Role: res[i].title,
                    "Department ID": res[i].department_id,
                    Department: res[i].department_name,
                    "Manager ID": res[i].manager_id,
                    "Manager Name": res[i].manager_first + " " + res[i].manager_last
                }
            );
        }
        console.table(referenceTable);
    })
}

