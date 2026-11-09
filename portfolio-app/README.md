# Portfolio application

A server-rendered portfolio and private admin area built with Node.js, Express, EJS, PostgreSQL and Prisma. This application is separate from the static GitHub Pages site in the repository root.

## Requirements

- Node.js 20 or later
- PostgreSQL database (local or managed)
- npm

## Local setup (PowerShell)

```powershell
cd portfolio-app
npm install
Copy-Item .env.example .env
```

Edit `.env` and set:
- `DATABASE_URL`: PostgreSQL connection string for your database
- `SESSION_SECRET`: a unique random secret of at least 32 characters
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`: initial administrator details. Use a strong password of at least 14 characters.

Generate a session secret in PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Database and first administrator

```powershell
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run admin:create
npm run seed:projects
npm run dev
```

Open `http://localhost:3000`. The administrator signs in at `/auth/login`. Six initial project entries are created as unpublished drafts; review them in the admin area and publish only after confirming their descriptions.

The admin bootstrap command hashes the password with bcrypt and upserts the configured administrator. Do not commit `.env` or share the generated credentials.

## Features included in this scaffold

- Public, server-rendered homepage and contact form
- PostgreSQL persistence for contact messages and projects
- Private administrator sign-in with bcrypt password verification
- PostgreSQL-backed sessions, session regeneration after login and HTTP-only cookies
- Per-session CSRF checks on POST requests
- Rate limits on authentication and contact routes
- Admin dashboard, message inbox, mark-as-read and delete actions
- Admin project create, edit, publish/unpublish, feature and delete actions
- Basic HTTPS URL and form-field validation
- Helmet security headers, 404/error pages and database health endpoint at `/health`

## Deployment notes

GitHub Pages cannot run this Express application. Deploy `portfolio-app` to a Node.js hosting provider and connect it to a managed PostgreSQL database. Configure environment variables in the host dashboard; never upload `.env`.

For production:
1. Set `NODE_ENV=production`.
2. Set a strong unique `SESSION_SECRET`.
3. Configure `DATABASE_URL` with the provider's connection string and SSL requirements.
4. Run `npm run prisma:generate` during build and `npx prisma migrate deploy` as the release/migration command.
5. Configure HTTPS and the hosting provider's trusted proxy behaviour.
6. Test login, logout, contact submission, project publishing, session expiry and database backups before directing a public domain to the app.

## Current status

This is an implementation scaffold, not a production deployment. It has not yet been run against a real PostgreSQL database or verified with end-to-end browser tests. Confirm database-provider SSL settings and test the full workflow before using it for live contact messages.