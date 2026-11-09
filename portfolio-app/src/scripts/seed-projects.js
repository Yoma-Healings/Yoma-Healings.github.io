require("dotenv").config();
const prisma = require("../config/database");

const projects = [
  {
    slug: "smart-security-street-light",
    title: "Smart Security Street Light",
    category: "Embedded Systems · IoT",
    summary: "A cost-conscious street-lighting prototype using ambient-light and motion sensing with a security-alert concept.",
    description: "The prototype concept combines an LDR for day/night detection, a radar or motion sensor, a microcontroller-based control system and an LED street-light load. The development direction includes an ESP32-based communication workflow and Telegram security notifications. The exact final wiring and tested configuration must be confirmed against the physical build before publication.",
    technologies: ["ESP32", "Arduino", "LDR", "Radar / Motion Sensor", "MOSFET", "Solar LED Lighting", "Telegram Bot"]
  },
  {
    slug: "studenthub",
    title: "StudentHub",
    category: "Backend Development · EdTech",
    summary: "A server-side learning-management platform project built around Node.js, Express and EJS.",
    description: "The project explores backend application structure, routing, controllers, server-rendered views and database integration. Its development focus is building maintainable features with a clear request and response flow.",
    technologies: ["Node.js", "Express", "EJS", "JavaScript", "PostgreSQL"]
  },
  {
    slug: "workforce-layoffs-analysis",
    title: "Workforce Layoffs Analysis",
    category: "Data Analytics",
    summary: "An exploratory analysis project examining reported workforce layoffs across companies, industries and time.",
    description: "The analytical workflow focuses on data inspection, cleaning, handling missing or inconsistent values, exploratory queries and visual summaries. Observed patterns should be interpreted as descriptions of the dataset, not proof of the causes of layoffs.",
    technologies: ["Python", "SQL", "Data Cleaning", "Exploratory Data Analysis", "Visualisation"]
  },
  {
    slug: "24v-5kva-inverter",
    title: "24V, 5kVA Inverter Project",
    category: "Electrical Engineering · Power Electronics",
    summary: "A departmental project exploring inverter-system design, battery sizing and load assessment.",
    description: "The project involved inverter and battery sizing, load assessment, wiring considerations and understanding how system voltage, power demand and battery capacity relate. Detailed component specifications and test results should be added from the original project documentation.",
    technologies: ["Power Electronics", "Inverter Systems", "Battery Sizing", "Load Assessment", "Electrical Safety"]
  },
  {
    slug: "vital-signs-monitoring",
    title: "Vital Signs Monitoring Prototype",
    category: "Embedded Systems · Multidisciplinary Research",
    summary: "A collaborative prototype concept for monitoring selected physiological parameters and ambient temperature.",
    description: "The project work covered heart rate, blood pressure, oxygen saturation (SpO2) and ambient temperature, with contributors from mechatronics, ICT and biosciences. This is described as a prototype and not as a clinically validated medical device.",
    technologies: ["Embedded Systems", "Sensor Integration", "Mechatronics", "ICT", "Biosciences"]
  },
  {
    slug: "crop-health-post-harvest-research",
    title: "Crop Health & Post-Harvest Research",
    category: "Applied Research · Bioscience",
    summary: "Research contributions involving tomato crop health, yield and post-harvest quality.",
    description: "Contributions included experimental design, phytochemical analysis, post-harvest quality analysis and microbial assays examining microbes associated with tomato yield and post-harvest quality. Specific findings and organisms should only be added from approved project records.",
    technologies: ["Experimental Design", "Phytochemical Analysis", "Post-Harvest Quality", "Microbial Assay"]
  }
];

async function main() {
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: { ...project, published: false, featured: false }
    });
  }
  console.log("Six portfolio project drafts are ready for review in the admin area.");
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());