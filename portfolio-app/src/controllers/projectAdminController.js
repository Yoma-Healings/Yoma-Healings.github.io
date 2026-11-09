const prisma = require("../config/database");

function slugify(value) {
  return String(value || "").toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
}
function formValues(body) {
  return {
    title: String(body.title || "").trim().slice(0, 150),
    category: String(body.category || "").trim().slice(0, 80),
    summary: String(body.summary || "").trim().slice(0, 300),
    description: String(body.description || "").trim().slice(0, 12000),
    technologies: String(body.technologies || "").split(",").map(x => x.trim()).filter(Boolean).slice(0, 20),
    imageUrl: String(body.imageUrl || "").trim() || null,
    repositoryUrl: String(body.repositoryUrl || "").trim() || null,
    liveUrl: String(body.liveUrl || "").trim() || null,
    featured: body.featured === "on",
    published: body.published === "on"
  };
}
function validUrl(value) {
  if (!value) return true;
  try { const url = new URL(value); return url.protocol === "https:"; }
  catch { return false; }
}
async function list(req, res, next) {
  try {
    const projects = await prisma.project.findMany({ orderBy: [{ updatedAt: "desc" }] });
    res.render("admin/projects", { title: "Manage projects", projects });
  } catch (error) { next(error); }
}
function newForm(req, res) {
  res.render("admin/project-form", { title: "New project", project: null, error: null });
}
async function create(req, res, next) {
  try {
    const data = formValues(req.body);
    if (!data.title || !data.category || !data.summary || !data.description ||
        !validUrl(data.imageUrl) || !validUrl(data.repositoryUrl) || !validUrl(data.liveUrl)) {
      return res.status(400).render("admin/project-form", { title: "New project", project: req.body, error: "Complete the required fields and use valid HTTPS URLs." });
    }
    const baseSlug = slugify(data.title);
    const slug = baseSlug + "-" + Date.now().toString(36);
    await prisma.project.create({ data: { ...data, slug } });
    res.redirect("/admin/projects");
  } catch (error) { next(error); }
}
async function editForm(req, res, next) {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project) return res.status(404).render("pages/404", { title: "Project not found" });
    res.render("admin/project-form", { title: "Edit project", project, error: null });
  } catch (error) { next(error); }
}
async function update(req, res, next) {
  try {
    const data = formValues(req.body);
    if (!data.title || !data.category || !data.summary || !data.description ||
        !validUrl(data.imageUrl) || !validUrl(data.repositoryUrl) || !validUrl(data.liveUrl)) {
      return res.status(400).render("admin/project-form", { title: "Edit project", project: { ...req.body, id: req.params.id }, error: "Complete the required fields and use valid HTTPS URLs." });
    }
    await prisma.project.update({ where: { id: req.params.id }, data });
    res.redirect("/admin/projects");
  } catch (error) { next(error); }
}
async function remove(req, res, next) {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.redirect("/admin/projects");
  } catch (error) { next(error); }
}
module.exports = { list, newForm, create, editForm, update, remove };