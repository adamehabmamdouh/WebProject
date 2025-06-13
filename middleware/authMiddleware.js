const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        // Set cache control headers to prevent back button
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Expires', '0');
        res.set('Pragma', 'no-cache');
        next();
    } else {
        // Clear session and redirect to login
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            res.redirect('/login');
        });
    }
};

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        // Set cache control headers to prevent back button
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Expires', '0');
        res.set('Pragma', 'no-cache');
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = {
    isAdmin,
    isAuthenticated
}; 