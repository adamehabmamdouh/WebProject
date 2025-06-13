// routes/indexRoutes.js
const express = require('express');
const router = express.Router();

// Import the User model if you intend to use it directly in these routes
// Although for general page rendering, you mainly need the session user.
// const User = require('../models/User'); 

// Middleware to ensure user is logged in for certain pages
const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    // Redirect to login with a message if not authenticated
    req.session.loginError = res.__('login_required'); // Assuming you have this i18n key
    res.redirect('/login');
};

// Route for the Home Page ('/')
router.get('/', async (req, res) => {
    try {
        // No need to fetch all users unless index.ejs specifically displays them
        res.render('index.ejs', {
            title: 'Elevate Fitness - Home',
            user: req.session.user || null, // Pass user session data
        });
    } catch (error) {
        console.error("Failed to load home page (indexRoutes):", error);
        res.status(500).send("Error loading home page. Please check server logs.");
    }
});

// Example: A simple route for an /about page
router.get('/about', (req, res) => {
    res.render('about', {
        title: res.__('about_us_page_title'),
        user: req.session.user || null, // Pass user session data
        lang: req.locale,
        translations: res.locals.translations
    });
});

router.get('/splits', (req, res) => {
    res.render('splits', {
        title: res.__('splits_page_title'),
        lang: req.locale,
        user: req.session.user || null // Pass user session data
    });
});

router.get('/nutrition', (req, res) => {
    res.render('nutrition', {
        title: res.__('nutrition_page_title'),
        lang: req.locale,
        user: req.session.user || null, // Pass user session data
        bmi_weight_placeholder: res.__('bmi_weight_placeholder'),
        bmi_height_placeholder: res.__('bmi_height_placeholder')
    });
});

router.get('/memberships', (req, res) => {
    res.render('Memberships', {
        title: res.__('memberships_page_title'),
        lang: req.locale,
        user: req.session.user || null // Pass user session data
    });
});

router.get('/supplements', (req, res) => {
    res.render('Supplements', {
        title: res.__('supplements_page_title'),
        lang: req.locale || 'en',
        user: req.session.user || null
    });
});

module.exports = router;