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
                console.log("add an employee");
                connection.end();
            } else if (answer.start === "Add a role") {
                console.log("add a role");
                connection.end();
            } else if (answer.start === "Add a department") {
                console.log("Add a department");
                addDepartment();
            } else if (answer.start === "View employee") {
                console.log("View employee");
                connection.end();
            } else if (answer.start === "View roles") {
                console.log("View roles");
                connection.end();
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
        for (let i = 0; i < res.length; i++) {
            console.table([
                {
                    department: res[i].name
                }
            ]);
        }
        start();
    })

}


    // function addEmployee(){
    //     inquirer
    //     .prompt([
    //         {
    //             name: "name",
    //             type: "input",
    //             message: "What is this employee's name?"
    //         }
    //     ])
    //     .then(function (answer) {
    //         connection.query(
    //             "INSERT INTO department SET ?",
    //             {
    //                 name: answer.department
    //             },
    //             function (err) {
    //                 if (err) throw err;
    //                 console.log("Deparment added succesfully!");

    //                 start();
    //             }
    //         );
    //     })

    // }

    // function addRole(){

