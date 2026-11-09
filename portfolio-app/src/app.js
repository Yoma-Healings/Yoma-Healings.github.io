require("dotenv").config();

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const { Pool } = require("pg");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  store: new pgSession({
    pool: new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined }),
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 1000 * 60 * 60 * 8 }
};

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required. Copy .env.example to .env and configure it.");
}

app.use(session(sessionOptions));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/", require("./routes/homeRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/contact", require("./routes/contactRoutes"));
app.use("/admin", require("./routes/adminRoutes"));

app.use((req, res) => res.status(404).render("pages/404", { title: "Page not found" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("pages/error", { title: "Something went wrong" });
});

module.exports = app;