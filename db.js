// const mysql = require('mysql');

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// try {
//     connection.connect((err) => {
//         if (err) {
//             console.error('Error connecting to database:', err);
//             return;
//         }
//         console.log('Connected to database');
//     });
// } catch (error) {
//     console.log(error);
// }

// module.exports = connection;

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// Add an error event handler
connection.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Reconnecting...');
        handleDisconnect(); // Reconnect if the connection is lost
    } else {
        throw err;
    }
});

function handleDisconnect() {
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database:', err);
            return;
        }
        console.log('Reconnected to database');
    });

    connection.on('error', (err) => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Reconnecting...');
            handleDisconnect(); // Reconnect if the connection is lost
        } else {
            throw err;
        }
    });
}

module.exports = connection;
