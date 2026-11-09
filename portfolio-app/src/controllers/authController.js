const bcrypt = require("bcryptjs");
const { findUserByEmail } = require("../models/userModel");

function showLogin(req, res) {
  res.render("auth/login", { title: "Admin login", error: null });
}

async function login(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = await findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).render("auth/login", {
        title: "Admin login",
        error: "Email or password is incorrect."
      });
    }

    req.session.regenerate((error) => {
      if (error) return next(error);
      req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
      res.redirect("/admin");
    });
  } catch (error) {
    next(error);
  }
}

function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie("portfolio.sid", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
    res.redirect("/auth/login");
  });
}

module.exports = { showLogin, login, logout };