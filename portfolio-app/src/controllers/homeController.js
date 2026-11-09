const prisma = require("../config/database");

async function index(req, res, next) {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
    });
    res.render("pages/home", { title: "Portfolio", projects, sent: req.query.message === "sent" });
  } catch (error) {
    next(error);
  }
}

module.exports = { index };