const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/authMiddleware');

router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Expires', '0');
    res.set('Pragma', 'no-cache');
    next();
});

router.get('/admin', isAdmin, (req, res) => {
    res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        user: req.session.user
    });
});

router.get('/admin/users', isAdmin, (req, res) => {
    res.render('admin/users', {
        title: 'User Management',
        user: req.session.user
    });
});

router.get('/admin/memberships', isAdmin, (req, res) => {
    res.render('admin/memberships', {
        title: 'Membership Management',
        user: req.session.user
    });
});

module.exports = router;