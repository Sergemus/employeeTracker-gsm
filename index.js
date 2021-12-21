const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const connection = require('./db/connection');


function queryChoices() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'This is the employee database! What would you like to do?',
        choices: [
            'View All Employees',
            'View All Roles',
            'View All Departments',
            'Add A Department',
            'Add A Role',
            'Add An Employee',
            'Update An Employee Role',
            'EXIT'
        ]
    }).then(function(choice) {
        switch(choice.action) {
            case 'View All Employees':
                viewEmployees();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Departments':
                viewDepartments();
                break;
            case 'Add A Department':
                addDepartment();
                break;
            case 'Add A Role':
                addRole();
                break;
            case 'Add An Employee':
                addEmployee();
                break;
            case 'Update An Employee Role':
                updateRole();
                break;
            case 'EXIT': 
                exitApp();
                break;
        }
    })
};

function viewEmployees() {
    let query = `SELECT * FROM employees`;
    connection.promise().query(query)
    .then(([rows]) => {
        let employees = rows;
        console.table(employees)
    })
    .then(() => queryChoices())
}

function viewRoles() {
    let query = `SELECT * FROM roles`;
    connection.promise().query(query)
    .then(([rows]) => {
        let roles = rows;
        console.table(roles)
    })
    .then(() => queryChoices())
}

function viewDepartments() {
    let query = `SELECT * FROM departments`;
    connection.promise().query(query)
    .then(([rows]) => {
        let departments = rows;
        console.table(departments)
    })
    .then(() => queryChoices())
}

function addDepartment() {
    inquirer.prompt([
        {   
            type: 'input',
            name: "name",
            message: 'What is the name of the new department?'
        }
    ])
    .then(res => {
        let name = res;
        console.log(name.name)
        connection.promise().query(`INSERT INTO departments SET ?`, {name: name.name})
        .then(() => console.log(`Added ${name.name} to the database`))
        .then(() => queryChoices())
        .catch((err)=> console.log(err))
    })
    
}

function addRole() {
    connection.promise().query(`SELECT * FROM departments`)
    .then(([rows]) => {
        let departments = rows
        const departmentChoices = departments.map(({ id, name}) => ({
            name: name,
            value: id
        }));
        inquirer.prompt([
            {
                type: 'input',
                name: "roleTitle",
                message: 'What is the title of the new role?'
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: "What is the salary of the new role?"
            },
            {
                type: "list",
                name: "departmentId",
                message: 'What department does the role belong to?',
                choices: departmentChoices
            }
        ]).then(newRole => {
            connection.promise().query(`INSERT INTO roles SET ?`, {title: newRole.roleTitle, salary: newRole.roleSalary, department_id: newRole.departmentId})
            .then(() => console.log(`Added ${newRole.roleTitle} to the database`))
            .then(() => queryChoices())
            .catch((err)=> console.log(err))
        })
    }) 
};

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "What is the new employee's first name?"
        },
        {
            type: 'input',
            name: 'last_name',
            message: "What is the new employee's last name?"
        }
    ])
    .then( res => {
        let firstName = res.first_name;
        let lastName = res.last_name;

        connection.promise().query('SELECT * FROM roles')
        .then(([rows]) => {
            let roles = rows;
            const roleChoices = roles.map(({id, title}) => ({
                name: title,
                value: id
            }))

            inquirer.prompt({
                type: 'list',
                name: 'roleId',
                message: "What is the employee's role?",
                choices: roleChoices
            })
            .then(res => {
                let roleId = res.roleId;

                connection.promise().query('SELECT * FROM employees')
                .then(([rows]) => {
                    let employees = rows;
                    const managerChoices = employees.map(({id, first_name, last_name}) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }));

                    managerChoices.unshift({ name: 'None', value: null});

                    inquirer.prompt({
                        type: 'list',
                        name: 'managerId',
                        message: "Who is the employee's manager?",
                        choices: managerChoices
                    })
                    .then( res => {
                        let employee = {
                            manager_id: res.managerId,
                            role_id: roleId,
                            first_name: firstName,
                            last_name: lastName
                        }

                        connection.promise().query('INSERT INTO employees SET ?', employee)
                    })
                    .then(() => console.log( `Added ${firstName} ${lastName} to database`))
                    .then(() => queryChoices())
                })
            })
        })
    })
}

function updateRole() {
    connection.promise().query('SELECT * FROM employees')
    .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({ id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: "Which employee's role would you like to update?",
                choices: employeeChoices
            }
        ])
        .then(res => {
            let employeeId = res.employeeId;
            connection.promise().query('SELECT * FROM roles')
            .then(([rows]) => {
                let roles = rows;
                const roleChoices = roles.map(({id, title}) => ({
                    name: title,
                    value: id
                }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roleId',
                        message: "Which role do you want to assign the selected employee?",
                        choices: roleChoices
                    }
                ])
                .then(res => connection.promise().query(
                    `UPDATE employees SET role_id = ${res.roleId} WHERE id =${employeeId} `
                ))
                .then(() => console.log(`Updated employee's role`))
                .then(() => queryChoices())
            })
        })
    })
}

function exitApp() {
    connection.end();
}

queryChoices();