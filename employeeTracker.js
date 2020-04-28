var mysql = require("mysql");
var inquirer = require("inquirer");

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

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});

function start(){
    inquirer
    .prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "start",
            choices: ["Add an employee","Add a role", "Add a department"]
        }
    ]).then(function(answer){
        if (answer.start === "Add an employee"){
            console.log("add an employee");
            connection.end();
        }else if (answer.start === "Add a role"){
            console.log("add a role");
            connection.end();
        }else{
            console.log("Add a department");
            connection.end();
        }
    })
}
// function addDepartment(){

// }

// function addEmployee(){
    
// }

// function addRole(){
    
// }