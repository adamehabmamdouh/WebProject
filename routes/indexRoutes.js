// routes/indexRoutes.js
const express = require('express');
const router = express.Router();

// Import the User model since you're using it on the homepage
const User = require('../models/User'); // Path adjusted assuming this is inside routes/

// Route for the Home Page ('/')
// This will replace the app.get('/') in your app.js once setupRoutes is used.
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}); // Fetch all users from the 'users' collection
        res.render('index.ejs', {
            title: 'Elevate Fitness - Home',
            users: users,
            // req.session.user should be available here if session middleware is set up correctly in app.js
            user: req.session.user === undefined ? "" : req.session.user,
        });
    } catch (error) {
        console.error("Failed to fetch users for home page (indexRoutes):", error);
        res.status(500).send("Error loading home page. Please check server logs.");
    }
});

// Example: A simple route for an /about page
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us',
        user: req.session.user === undefined ? "" : req.session.user,
    });
});
router.get('/splits', (req, res) => {
    res.render('splits', { // This will look for 'splits.ejs' in your views/layouts directory
        title: res.__('splits_page_title'), // Use i18n for the page title
        lang: req.locale, // Passes the current language for the <html> tag
        loggedInUser: req.session.user || null // Passes user session data
    });
});
router.get('/nutrition', (req, res) => {
    res.render('nutrition', {
        title: res.__('nutrition_page_title'), // Get title from i18n
        lang: req.locale, // Pass current locale
        loggedInUser: req.session.user || null, // Pass user session data
        // Pass translated placeholders for BMI calculator inputs
        bmi_weight_placeholder: res.__('bmi_weight_placeholder'),
        bmi_height_placeholder: res.__('bmi_height_placeholder')
    });
});

router.get('/memberships', (req, res) => {
    res.render('Memberships', { // Assuming 'Memberships.ejs' is in 'views/layouts/'
        title: res.__('memberships_page_title'), // Use i18n for the page title
        lang: req.locale, // Pass the current language for the <html> tag
        loggedInUser: req.session.user || null // Pass user session data
        // You can add more data here if the memberships page needs dynamic content
    });
});

// routes/indexRoutes.js
// ... (existing imports and routes) ...

router.get('/supplements', (req, res) => {
    res.render('Supplements', {
        title: res.__('supplements_page_title'),
        lang: req.locale || 'en',
        loggedInUser: req.session.user || null
    });
    
});

router.get('/about', (req, res) => {
    res.render('about', {
        title: res.__('about_us_page_title'), // Use the specific about page title from i18n
        user: req.session.user === undefined ? "" : req.session.user,
        lang: req.locale, // Pass the current language for the <html> tag
        translations: res.locals.translations // **Crucial: Pass the entire translations object**
    });
});
module.exports = router;
