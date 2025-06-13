const express = require('express');
const router = express.Router();

const User = require('../models/user'); 


router.post('/', async (req, res) => { 
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send('Please provide name, email, and password.');
        }

        
        const newUser = await User.create({ name, email, password });
        console.log('User created successfully:', newUser);

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

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found.');
        }
        res.send(`User Profile: ${user.name}`); 
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Error fetching user data.");
    }
});

module.exports = router;