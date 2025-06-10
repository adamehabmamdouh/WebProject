const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// ... existing code ...

// Delete user route
router.delete('/admin/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// ... existing code ...

// Admin route to display users
router.get('/admin', async (req, res) => {
    try {
        // Fetch all users from MongoDB, excluding password field
        const users = await User.find({}).select('-password');
        res.render('admin', {
            title: 'Admin Panel',
            users: users
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Error loading admin panel');
    }
});

// ... existing code ...
// --- GET /signup - Display the signup form ---
router.get('/signup', (req, res) => {
    // Render the signup.ejs template
    res.render('signup', {
        title: res.__('signup_title'), // Using i18n
        errors: req.session.errors, // Pass any validation errors
        formData: req.session.formData // Pass back form data on error
    });
    // Clear session messages after rendering
    req.session.errors = null;
    req.session.formData = null;
});

// --- POST /signup - Handle signup form submission ---
router.post('/signup', async (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body;
    let errors = {}; // Object to store validation errors

    // Basic server-side validation
    if (!username || !email || !password || !confirmPassword) {
        errors.fields = res.__('all_fields_required');
    }
    if (password !== confirmPassword) {
        errors.passwordMatch = res.__('passwords_do_not_match');
    }
    if (password && password.length < 6) {
        errors.passwordLength = res.__('password_min_length', 6);
    }
    // You can add more complex regex validation for email/username here

    if (Object.keys(errors).length > 0) {
        req.session.errors = errors;
        req.session.formData = { username, email }; // Keep other fields for re-population
        return res.redirect('/signup'); // Redirect back to signup form with errors
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username: username }, { email: email }] });
        if (existingUser) {
            if (existingUser.username === username) {
                errors.usernameExists = res.__('username_already_exists');
            }
            if (existingUser.email === email) {
                errors.emailExists = res.__('email_already_exists');
            }
            req.session.errors = errors;
            req.session.formData = { username, email };
            return res.redirect('/signup');
        }

        // Create new user
        const newUser = new User({ username, email, password });
        await newUser.save();

        // Log the user in immediately after signup (optional)
        req.session.user = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email
        };
        req.session.successMessage = res.__('signup_success'); // Set a success message for a flash message

        // Redirect to a dashboard or homepage
        res.redirect('/'); // Or '/dashboard'
    } catch (err) {
        // Handle database errors (e.g., duplicate key if unique constraint failed)
        console.error('Signup error:', err);
        if (err.code === 11000) { // MongoDB duplicate key error
            if (err.keyPattern.username) errors.usernameExists = res.__('username_already_exists');
            if (err.keyPattern.email) errors.emailExists = res.__('email_already_exists');
        }
        req.session.errors = errors;
        req.session.formData = { username, email };
        next(err); // Pass to general error handler
        res.redirect('/signup'); // Redirect back if error can be shown on form
    }
});

// --- GET /login - Display the login form ---
router.get('/login', (req, res) => {
    res.render('login', {
        title: res.__('login_title'), // Using i18n
        error: req.session.loginError, // Pass login error message
        successMessage: req.session.successMessage // Pass success message (e.g. from signup)
    });
    // Clear session messages after rendering
    req.session.loginError = null;
    req.session.successMessage = null;
});

// --- POST /login - Handle login form submission ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        req.session.loginError = res.__('all_fields_required');
        return res.redirect('/login');
    }

    try {
        // Find user by username or email
        const user = await User.findOne({ $or: [{ username: username }, { email: username }] });

        if (!user) {
            req.session.loginError = res.__('invalid_credentials');
            return res.redirect('/login');
        }

        // Compare submitted password with hashed password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            req.session.loginError = res.__('invalid_credentials');
            return res.redirect('/login');
        }

        // Authentication successful, store user info in session
        req.session.user = {
            _id: user._id,
            username: user.username,
            email: user.email
        };
        res.redirect('/'); // Redirect to homepage or dashboard
    } catch (err) {
        console.error('Login error:', err);
        req.session.loginError = res.__('login_failed_general');
        res.redirect('/login');
    }
});

// --- GET /logout - Handle user logout ---
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/'); // Fallback
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.redirect('/login'); // Redirect to login page after logout
    });
});

// Admin route to display users
router.get('/admin', async (req, res) => {
    try {
        // Fetch all users from MongoDB, excluding password field
        const users = await User.find({}).select('-password');
        res.render('admin', {
            title: 'Admin Panel',
            users: users
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Error loading admin panel');
    }
});

// Delete user route
router.delete('/admin/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});


module.exports = router;