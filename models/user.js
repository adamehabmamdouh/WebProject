const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: [true, 'Please add a username'], 
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'], 
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please add a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'], 
        minlength: [6, 'Password must be at least 6 characters long'] 
    },
    name: {
        type: String,
        required: false, 
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    membershipType: { 
        type: String,
        enum: ['None', 'Basic', 'Premium', 'Elite'], 
        default: 'None' 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true 
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); 
        this.password = await bcrypt.hash(this.password, salt); 
        next();
    } catch (err) {
        next(err); 
    }
});


userSchema.methods.comparePassword = async function(candidatePassword) {
    
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;