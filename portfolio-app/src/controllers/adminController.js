const prisma = require("../config/database");

async function dashboard(req, res, next) {
  try {
    const [projectCount, messageCount, unreadCount, recentMessages] = await Promise.all([
      prisma.project.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 8 })
    ]);
    res.render("admin/dashboard", {
      title: "Admin dashboard",
      stats: { projectCount, messageCount, unreadCount },
      recentMessages
    });
  } catch (error) {
    next(error);
  }
}

async function messages(req, res, next) {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    res.render("admin/messages", { title: "Contact messages", messages });
  } catch (error) {
    next(error);
  }
}

async function markMessageRead(req, res, next) {
  try {
    await prisma.contactMessage.update({ where: { id: req.params.id }, data: { read: true } });
    res.redirect("/admin/messages");
  } catch (error) {
    next(error);
  }
}

async function deleteMessage(req, res, next) {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.redirect("/admin/messages");
  } catch (error) {
    next(error);
  }
}

module.exports = { dashboard, messages, markMessageRead, deleteMessage };