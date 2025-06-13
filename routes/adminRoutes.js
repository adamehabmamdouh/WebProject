const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/authMiddleware');

// Add middleware to handle back button for all admin routes
router.use((req, res, next) => {
    // Set cache control headers to prevent back button
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Expires', '0');
    res.set('Pragma', 'no-cache');
    next();
});

// Admin dashboard
router.get('/admin', isAdmin, (req, res) => {
    res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        user: req.session.user
    });
});

// Admin users management
router.get('/admin/users', isAdmin, (req, res) => {
    res.render('admin/users', {
        title: 'User Management',
        user: req.session.user
    });
});

// Admin memberships management
router.get('/admin/memberships', isAdmin, (req, res) => {
    res.render('admin/memberships', {
        title: 'Membership Management',
        user: req.session.user
    });
});

module.exports = router; 