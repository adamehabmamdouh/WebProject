// models/User.js
const mongoose = require('mongoose');

// Define the schema for your User model
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'], // 'true' makes it required, you can add a custom message
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true, // Ensures each email address is unique in the database
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please add a valid email address'] // Basic email regex validation
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: [6, 'Password must be at least 6 characters long']
        },
        // You can add more fields as your application needs them:
        // isAdmin: {
        //     type: Boolean,
        //     default: false,
        // },
        // bio: String,
        // dateOfBirth: Date,
        // hobbies: [String], // Array of strings
    },
    {
        timestamps: true, // Mongoose automatically adds `createdAt` and `updatedAt` fields
    }
);

// Create the Mongoose model from the schema
// 'User' is the name of your model. Mongoose will pluralize it to 'users'
// for the collection name in MongoDB.
const User = mongoose.model('User', userSchema);

module.exports = User; // Export the model for use in controllers