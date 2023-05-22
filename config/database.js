const mongoose = require('mongoose');  // for database connection and schemas

const dbConncetion = () => {
    mongoose.connect(process.env.DB_URI)
        .then((conn) => {
            console.log(`Database Connected: ${conn.connection.host}`);
        })
    // THIS ERROR CATCH IS CAUGHT IN THE server.js FILE
    // .catch((err) => {
    //     console.error(`Database Error: ${err}`);
    //     process.exit(1);
    // });
};

module.exports = dbConncetion;