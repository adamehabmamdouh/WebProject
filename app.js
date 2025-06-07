require("dotenv").config();
const ejs = require("ejs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const fs = require("fs");
const https = require("https");
const i18n = require("i18n");
const { connectToMongoDB } = require("./config/db.js");
const { setupRoutes } = require("./routes/routes.js");

const app = express();
const port = process.env.PORT || 3000;

i18n.configure({
  locales: ['en', 'es', 'fr'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
  cookie: 'lang'
});

app.use(i18n.init);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());



app.use((req, res, next) => {
  const lang = req.query.lang || req.acceptsLanguages(i18n.getLocales()) || 'en';
  res.cookie('lang', lang, { maxAge: 900000, httpOnly: true });
  req.setLocale(lang);
  res.locals.lang = lang;
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const options = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
};

connectToMongoDB()
  .then(() => {
    https.createServer(options, app).listen(port, () => {
      console.log(`HTTPS Server is running at https://localhost:${port}/`);
    });
    setupRoutes(app);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

module.exports = app;
