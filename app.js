// app.js
require("dotenv").config(); // Load environment variables from .env at the very top
const path = require("path");
const express = require("express");
const session = require("express-session");
const fs = require("fs"); // For HTTPS keys
const https = require("https"); // For HTTPS server
const i18n = require("i18n");

// Correct import for your DB connection function
const connectDB = require("./config/db.js"); // Assuming db.js exports `connectDB` directly

// Correct import for your routes setup function
// If setupRoutes in routes.js correctly wires up all your individual routers, keep this.
// Otherwise, you might prefer to import individual route files (e.g., const indexRoutes = require("./routes/indexRoutes");)
const { setupRoutes } = require("./routes/routes.js"); // Assuming routes.js exports { setupRoutes }

const app = express();
const port = process.env.PORT || 3000;

// --- Connect to MongoDB Atlas (Call it early in the process) ---
// The connectDB function itself handles errors and exits if connection fails.
connectDB();

// --- Middleware Setup ---

// 1. Static Files Middleware (FIRST, after core setup)
// This is crucial for serving CSS, JS, images correctly.
// MUST be before any route definitions or body parsers that might intercept.
app.use(express.static(path.join(__dirname, 'public')));
// Removed: app.use(express.static(path.join(__dirname, 'views'))); // DANGER: Don't serve raw views!
// Removed duplicate: app.use(express.static(path.join(__dirname, 'public')));

// 2. Body Parsers (for form data and JSON)
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json()); // For parsing application/json
app.use('/locales', express.static(path.join(__dirname, 'locales')));

// 3. i18n Configuration (before session if language choice influences session)
i18n.configure({
    locales: ['en', 'es', 'fr'],
    directory: path.join(__dirname, 'locales'),
    defaultLocale: 'en',
    cookie: 'lang'
});
app.use(i18n.init); // Initialize i18n middleware after configuration

// 4. Session Middleware (MUST be before any code that uses req.session, including res.locals.loggedInUser)
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your_default_secret_key_if_env_missing', // Use a strong, random key
        resave: false, // Don't save session if unmodified
        saveUninitialized: false, // Don't create session until something stored
        cookie: {
            secure: process.env.NODE_ENV === "production", // True in production (HTTPS), false in development (HTTP)
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
        },
    })
);

// 5. Custom Middleware to set locale and make res.locals available
// Place this AFTER i18n.init and session middleware
app.use((req, res, next) => {
    // Set locale based on query param, cookie, or browser preference
    // req.cookies needs 'cookie-parser' middleware if not already present,
    // or you can rely on req.query.lang or req.acceptsLanguages for initial setup.
    const lang = req.query.lang || req.acceptsLanguages(i18n.getLocales())[0] || 'en';
    res.cookie('lang', lang, { maxAge: 900000, httpOnly: true }); // Set cookie for persistence
    req.setLocale(lang); // Set locale for the current request
    res.locals.lang = lang; // Make available to EJS templates

    // Safely access req.session.user ONLY after session middleware has run
    res.locals.loggedInUser = req.session.user || null; // This resolves TypeError: Cannot read properties of undefined (reading 'user')
    res.locals.currentYear = new Date().getFullYear(); // Example global variable
    next();
});

// --- EJS Templating Engine Setup ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views", "layouts")); // CRITICAL: Points to the 'layouts' folder for templates

// --- Setup Routes ---
// Call setupRoutes after all middleware is configured
setupRoutes(app); // Ensure this function in routes.js correctly attaches all your routers

// --- HTTPS Server Setup ---
// IMPORTANT: Ensure you have 'ssl' folder with 'key.pem' and 'cert.pem'
// The 'options' object is defined but the server creation is commented out.
// This is fine as long as you are explicitly using the HTTP server below.
const options = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
};

/* Start the HTTPS server
https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS Server is running at https://localhost:${port}/`);
});*/

// --- Alternative: Simple HTTP Server (for easier development) ---
// This will run if the HTTPS server creation block remains commented out.
app.listen(port, () => {
    console.log(`HTTP Server is running at http://localhost:${port}/`);
});

// Removed: module.exports = app; // Not typically needed for the main app.js that starts the server