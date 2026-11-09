const prisma = require("../config/database");

async function createMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).send("Name, email and message are required.");
    }
    await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject?.trim() || null,
        message: message.trim()
      }
    });
    res.redirect("/?message=sent#contact");
  } catch (error) {
    next(error);
  }
}

module.exports = { createMessage };