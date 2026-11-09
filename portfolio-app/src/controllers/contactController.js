const prisma = require("../config/database");

async function createMessage(req, res, next) {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const subject = String(req.body.subject || "").trim();
    const message = String(req.body.message || "").trim();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || name.length > 100 || !emailIsValid || email.length > 254 ||
        subject.length > 150 || !message || message.length > 5000) {
      return res.status(400).send("Please provide a valid name, email and message within the stated limits.");
    }

    await prisma.contactMessage.create({
      data: { name, email, subject: subject || null, message }
    });
    res.redirect("/?message=sent#contact");
  } catch (error) {
    next(error);
  }
}

module.exports = { createMessage };