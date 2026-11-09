require("dotenv").config();

const express = require("express");
const path = require("path");
const crypto = require("crypto");
const helmet = require("helmet");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const pgSession = require("connect-pg-simple")(session);
const { Pool } = require("pg");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  throw new Error("SESSION_SECRET must be set to a random value of at least 32 characters.");
}
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Configure it in your .env file.");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.disable("x-powered-by");
if (isProduction) app.set("trust proxy", 1);

app.use(helmet());
app.use(express.urlencoded({ extended: false, limit: "20kb" }));
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public"), { maxAge: isProduction ? "1d" : 0 }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : undefined
});

app.use(session({
  store: new pgSession({ pool, createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: "portfolio.sid",
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 8
  }
}));

// A per-session CSRF token protects every state-changing form submission.
app.use((req, res, next) => {
  if (!req.session.csrfToken) req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  res.locals.csrfToken = req.session.csrfToken;
  res.locals.currentUser = req.session.user || null;

  if (req.method === "POST") {
    const submitted = String(req.body?._csrf || "");
    const expected = req.session.csrfToken;
    const valid = submitted.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(submitted), Buffer.from(expected));
    if (!valid) return res.status(403).render("pages/403", { title: "Request could not be verified" });
  }
  next();
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many sign-in attempts. Please try again in 15 minutes."
});
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many messages from this connection. Please try again later."
});

app.get("/health", async (req, res, next) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    next(error);
  }
});

app.use("/", require("./routes/homeRoutes"));
app.use("/auth", loginLimiter, require("./routes/authRoutes"));
app.use("/contact", contactLimiter, require("./routes/contactRoutes"));
app.use("/admin", require("./routes/adminRoutes"));

app.use((req, res) => res.status(404).render("pages/404", { title: "Page not found" }));

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).render("pages/error", { title: "Something went wrong" });
});

module.exports = app;