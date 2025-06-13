const express = require('express');
const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    req.session.loginError = res.__('login_required');
    res.redirect('/login');
};

router.get('/', async (req, res) => {
    try {
        res.render('index.ejs', {
            title: 'Elevate Fitness - Home',
            user: req.session.user || null,
        });
    } catch (error) {
        console.error("Failed to load home page (indexRoutes):", error);
        res.status(500).send("Error loading home page. Please check server logs.");
    }
});

router.get('/about', (req, res) => {
    res.render('about', {
        title: res.__('about_us_page_title'),
        user: req.session.user || null,
        lang: req.locale,
        translations: res.locals.translations
    });
});

router.get('/splits', (req, res) => {
    res.render('splits', {
        title: res.__('splits_page_title'),
        lang: req.locale,
        user: req.session.user || null
    });
});

router.get('/nutrition', (req, res) => {
    res.render('nutrition', {
        title: res.__('nutrition_page_title'),
        lang: req.locale,
        user: req.session.user || null,
        bmi_weight_placeholder: res.__('bmi_weight_placeholder'),
        bmi_height_placeholder: res.__('bmi_height_placeholder')
    });
});

router.get('/memberships', (req, res) => {
    res.render('Memberships', {
        title: res.__('memberships_page_title'),
        lang: req.locale,
        user: req.session.user || null
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