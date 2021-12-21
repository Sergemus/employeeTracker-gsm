const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employeeTracker_db'
});

connection.connect(function(err) {
    if(err) throw err;
    console.log("Connection to database was successful!")
})

module.exports = connection;