// routes/userRoutes.js
const express = require('express');
const router = express.Router();

// Import the User model if this router will interact with user data directly
const User = require('../models/User'); // Path adjusted assuming this is inside routes/

// Route to handle adding a new user from a form (moved from app.js)
// This will be accessible at /user/ (or just / depending on how you mount it in central routes.js)
// But based on your central routes.js, this will be mounted under '/user'
// So, the POST request should be sent to /user/ or /user/add, etc.
router.post('/', async (req, res) => { // This will now be accessible at /user
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send('Please provide name, email, and password.');
        }

        // --- IMPORTANT: Password Hashing for Production ---
        // If you've uncommented and are using bcryptjs in app.js,
        // you would require it here and hash the password before saving.
        // const bcrypt = require('bcryptjs');
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);
        // const newUser = await User.create({ name, email, password: hashedPassword });

        // For development/demonstration, saving plain text password:
        const newUser = await User.create({ name, email, password });
        console.log('User created successfully:', newUser);

        // Redirect back to the home page or a user list page
        res.redirect('/');
    } catch (error) {
        if (error.code === 11000) {
            console.error("Duplicate email error:", error.keyValue);
            return res.status(400).send('Email already exists. Please use a different email.');
        }
        console.error("Error creating user:", error.message);
        res.status(500).send(`Error creating user: ${error.message}. Please try again.`);
    }
});

// Example: A route to get a specific user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found.');
        }
        res.send(`User Profile: ${user.name}`); // Replace with rendering a user profile EJS
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Error fetching user data.");
    }
});

module.exports = router;