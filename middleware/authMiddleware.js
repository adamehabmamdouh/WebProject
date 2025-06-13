const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Expires', '0');
        res.set('Pragma', 'no-cache');
        next();
    } else {
       
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