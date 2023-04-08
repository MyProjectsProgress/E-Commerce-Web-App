const mongoose = require('mongoose');

const dbConncetion = () => {
    mongoose.connect(process.env.DB_URI)
        .then((conn) => {
            console.log(`Database connected: ${conn.connection.host}`);
        })
        .catch((err) => {
            console.error(`Database Error: ${err}`);
            process.exit(1);
        });
};

module.exports = dbConncetion;