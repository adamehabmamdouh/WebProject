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
const { setupRoutes } = require("./routes/routes.js"); // Assuming routes.js exports { setupRoutes }

const app = express();
const port = process.env.PORT || 3000;

// --- Initialize i18n (Internationalization) ---
i18n.configure({
    locales: ['en', 'es', 'fr'],
    directory: path.join(__dirname, 'locales'),
    defaultLocale: 'en',
    cookie: 'lang'
});
app.use(i18n.init); // Initialize i18n middleware

// --- Connect to MongoDB Atlas (Call it early in the process) ---
// The connectDB function itself handles errors and exits if connection fails.
connectDB();

// --- Middleware Setup ---
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Removed: app.use(express.static(path.join(__dirname, 'views'))); // Don't serve views as static

// Body parsers for form data and JSON (replace body-parser)
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json()); // For parsing application/json

// Middleware to set locale based on query param or accepted languages
app.use((req, res, next) => {
    const lang = req.query.lang || req.acceptsLanguages(i18n.getLocales())[0] || 'en'; // Accepts languages can return an array
    res.cookie('lang', lang, { maxAge: 900000, httpOnly: true });
    req.setLocale(lang);
    res.locals.lang = lang; // Make lang available in EJS templates
    next();
});

// Session middleware (MUST be before any routes that use sessions)
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

// --- EJS Templating Engine Setup ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- Setup Routes ---
// Call setupRoutes after all middleware is configured
setupRoutes(app);

// --- HTTPS Server Setup ---
// IMPORTANT: Ensure you have 'ssl' folder with 'key.pem' and 'cert.pem'
// For initial testing, you might want to comment out the HTTPS part and
// use a simple HTTP server (see commented out section below).
const options = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
};

// Start the HTTPS server
https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS Server is running at https://localhost:${port}/`);
});

// --- Alternative: Simple HTTP Server (for easier development) ---
/*
app.listen(port, () => {
    console.log(`HTTP Server is running at http://localhost:${port}/`);
});
*/

// Removed: module.exports = app; // Not typically needed for the main app.js that starts the server