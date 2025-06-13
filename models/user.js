// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing - make sure to 'npm install bcryptjs'

const userSchema = new mongoose.Schema({
    username: { // Using username for a distinct login identifier
        type: String,
        required: [true, 'Please add a username'], // Custom message
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'], // Custom message
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please add a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'], // Custom message
        minlength: [6, 'Password must be at least 6 characters long'] // Custom message
    },
    // If you still want a 'name' field that's just a display name:
    name: {
        type: String,
        required: false, // Not strictly required if username is the primary identifier
        trim: true
    },
        membershipType: { // New field for membership
        type: String,
        enum: ['None', 'Basic', 'Premium', 'Elite'], // Define allowed values
        default: 'None' // Default membership type
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true // Mongoose automatically adds `createdAt` and `updatedAt`
});

// --- Pre-save hook to hash password before saving ---
userSchema.pre('save', async function(next) {
    // Only hash if the password has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next();
    } catch (err) {
        next(err); // Pass error to the next middleware
    }
});

// --- Method to compare password for login ---
userSchema.methods.comparePassword = async function(candidatePassword) {
    // Compare the given password with the hashed password in the database
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;