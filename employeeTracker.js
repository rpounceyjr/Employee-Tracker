var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

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
                    "View employee", "View roles", "View departments"]
            }
        ]).then(function (answer) {
            if (answer.start === "Add an employee") {
                addEmployee();
            } else if (answer.start === "Add a role") {
                addRole();
            } else if (answer.start === "Add a department") {
                console.log("Add a department");
                addDepartment();
            } else if (answer.start === "View employee") {
                viewEmployees()
            } else if (answer.start === "View roles") {
                viewRoles();
            } else {
                viewDepartment();
            }
        })
}
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
    connection.query("SELECT * FROM role LEFT JOIN department ON role.department_id = department.id", function (err, res) {
        if (err) throw err;
        const rolesArray = [];
        for (let i = 0; i < res.length; i++) {
            rolesArray.push(
                {
                    Role: res[i].title,
                    Salary: res[i].salary,
                    Department: res[i].name

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
        })
}
function viewEmployees() {
    connection.query("SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id", function (err, res) {
        if (err) throw err;
        const employeesArray = [];
        for (let i = 0; i < res.length; i++) {
            employeesArray.push(
                {
                    ID : res[i].id,
                    Name: res[i].first_name + " " + res[i].last_name,
                    Role: res[i].title,
                    "Manager ID": res[i].manager_id
                }
            );
        }
        console.table(employeesArray);
        start();
    })
}

