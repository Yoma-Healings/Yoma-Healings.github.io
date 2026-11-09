function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect("/auth/login");
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "ADMIN") {
    return res.status(403).render("pages/403", { title: "Access denied" });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };