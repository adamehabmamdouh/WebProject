
require("dotenv").config(); 
const path = require("path");
const express = require("express");
const session = require("express-session");
const fs = require("fs"); 
const https = require("https"); 
const i18n = require("i18n");

const connectDB = require("./config/db.js"); 


const { setupRoutes } = require("./routes/routes.js"); 

const app = express();
const port = process.env.PORT || 3000;
connectDB();


app.use(express.static(path.join(__dirname, 'public')));



app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use('/locales', express.static(path.join(__dirname, 'locales')));


i18n.configure({
    locales: ['en', 'es', 'fr'],
    directory: path.join(__dirname, 'locales'),
    defaultLocale: 'en',
    cookie: 'lang'
});
app.use(i18n.init); 
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your_default_secret_key_if_env_missing', 
        resave: false, 
        saveUninitialized: false, 
        cookie: {
            secure: process.env.NODE_ENV === "production", 
            maxAge: 1000 * 60 * 60 * 24, 
        },
    })
);


app.use((req, res, next) => {
    
    const lang = req.query.lang || req.acceptsLanguages(i18n.getLocales())[0] || 'en';
    res.cookie('lang', lang, { maxAge: 900000, httpOnly: true }); 
    req.setLocale(lang); 
    res.locals.lang = lang; 

    
    res.locals.loggedInUser = req.session.user || null; 
    res.locals.currentYear = new Date().getFullYear(); 
    next();
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views", "layouts")); 


setupRoutes(app); 
const options = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
};


app.listen(port, () => {
    console.log(`HTTP Server is running at http://localhost:${port}/`);
});
