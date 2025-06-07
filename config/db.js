// config/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // This line loads variables from your .env file

const connectDB = async () => {
    try {
        // Mongoose connects using the MONGO_URI from your .env file
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,      // Standard option to parse connection string
            useUnifiedTopology: true,   // Standard option for server discovery and monitoring
            // Removed useCreateIndex and useFindAndModify as they are no longer needed in recent Mongoose versions
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        // Exit process with failure (useful for critical startup errors)
        process.exit(1);
    }
};

module.exports = connectDB; // Export the function so you can call it from your main app file








