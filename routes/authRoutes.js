const express = require('express');
const router = express.Router();
const User = require('../models/user');

const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.status(401).json({ error: 'You must be logged in to perform this action.' });
};

router.post('/memberships/update', ensureAuthenticated, async (req, res) => {
    console.log('Received /memberships/update request');
    try {
        const userId = req.session.user._id;
        const { membershipType } = req.body;

        console.log('User ID from session:', userId);
        console.log('Membership Type from request body:', membershipType);

        const allowedMembershipTypes = ['Basic', 'Premium', 'Elite'];
        if (!allowedMembershipTypes.includes(membershipType)) {
            console.log('Invalid membership type:', membershipType);
            return res.status(400).json({ error: 'Invalid membership type provided.' });
        }

        const user = await User.findById(userId);

        if (!user) {
            console.log('User not found in DB for ID:', userId);
            return res.status(404).json({ error: 'User not found.' });
        }

        console.log('User found:', user.username, 'Current membership:', user.membershipType);

        user.membershipType = membershipType;
        await user.save();

        req.session.user.membershipType = membershipType;
        console.log('Membership updated in DB and session for user:', user.username);

        res.status(200).json({ message: `Membership updated to ${membershipType} successfully!` });
    } catch (err) {
        console.error('Error updating membership:', err);
        if (err.name === 'CastError' && err.path === '_id') {
            console.error('Invalid User ID format:', err.message);
        }
        res.status(500).json({ error: 'Failed to update membership.' });
    }
});

router.get('/signup', (req, res) => {
    if (req.session.user) {
        return res.redirect('/memberships');
    }
    res.render('signup', {
        title: res.__('signup_title'),
        errors: req.session.errors,
        formData: req.session.formData
    });
    req.session.errors = null;
    req.session.formData = null;
});

router.post('/signup', async (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body;
    let errors = {};

    if (!username || !email || !password || !confirmPassword) {
        errors.fields = res.__('all_fields_required');
    }
    if (password !== confirmPassword) {
        errors.passwordMatch = res.__('passwords_do_not_match');
    }
    if (password && password.length < 6) {
        errors.passwordLength = res.__('password_min_length', 6);
    }

    if (Object.keys(errors).length > 0) {
        req.session.errors = errors;
        req.session.formData = { username, email };
        return res.redirect('/signup');
    }

    try {
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

        const newUser = new User({ username, email, password });
        await newUser.save();

        req.session.user = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            membershipType: newUser.membershipType
        };
        req.session.successMessage = res.__('signup_success');

        res.redirect('/memberships');
    } catch (err) {
        console.error('Signup error:', err);
        if (err.code === 11000) {
            if (err.keyPattern.username) errors.usernameExists = res.__('username_already_exists');
            if (err.keyPattern.email) errors.emailExists = res.__('email_already_exists');
        }
        req.session.errors = errors;
        req.session.formData = { username, email };
        next(err);
        res.redirect('/signup');
    }
});

router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/memberships');
    }
    res.render('login', {
        title: res.__('login_title'),
        error: req.session.loginError,
        successMessage: req.session.successMessage
    });
    req.session.loginError = null;
    req.session.successMessage = null;
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        req.session.loginError = res.__('all_fields_required');
        return res.redirect('/login');
    }

    try {
        const user = await User.findOne({ $or: [{ username: username }, { email: username }] });

        if (!user) {
            req.session.loginError = res.__('invalid_credentials');
            return res.redirect('/login');
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            req.session.loginError = res.__('invalid_credentials');
            return res.redirect('/login');
        }

        req.session.user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            membershipType: user.membershipType
        };

        if (user.role === 'admin') {
            res.redirect('http://localhost:3000/admin');
        } else {
            res.redirect('/memberships');
        }
    } catch (err) {
        console.error('Login error:', err);
        req.session.loginError = res.__('login_failed_general');
        res.redirect('/login');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

router.get('/admin', async (req, res) => {
    try {
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

router.post('/admin/users', async (req, res) => {
    try {
        const { username, email, password, isAdmin } = req.body;

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                error: existingUser.username === username ?
                    'Username already exists' :
                    'Email already exists'
            });
        }

        const newUser = new User({
            username,
            email,
            password,
            isAdmin: isAdmin || false
        });
        await newUser.save();

        res.status(201).json({
            message: 'User created successfully',
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                isAdmin: newUser.isAdmin
            }
        });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

module.exports = router;