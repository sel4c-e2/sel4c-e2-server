const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

try {
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database:', err);
            return;
        }
        console.log('Connected to database');
    });
} catch (error) {
    console.log(error);
}

module.exports = connection;

// const mysql = require('mysql');

// let connectionAttempt = 1;
// const maxConnectionAttempts = 15;

// function connectToDatabase() {
//     console.log(`Attempting connection to database (${connectionAttempt}/${maxConnectionAttempts})...`);
//     const connection = mysql.createConnection({
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME
//     });
//     connection.connect((err) => {
//         if (err) {
//             console.error('Error connecting to database:', err);
//             if (connectionAttempt <= maxConnectionAttempts) {
//                 console.log(`Retrying connection (Attempt ${connectionAttempt + 1}/${maxConnectionAttempts})...`);
//                 connectionAttempt++;
//                 setTimeout(connectToDatabase, 5000);
//             } else {
//                 console.error(`Max connection attempts (${maxConnectionAttempts}) reached. Could not connect to database.`);
//             }
//         } else {
//             console.log('Connected to database');
//         }
//     });
//     return connection;
// }

// const connection = connectToDatabase();

// module.exports = connection;
