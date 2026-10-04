# Digital College Notice Board

A college-specific digital notice board built with the MERN stack. Faculty publish notices, students read, search and
comment on them, and **every college only ever sees its own data**. Urgent and important notices are highlighted
automatically and pinned to the top.

## Features

- Student and faculty registration/login (JWT + hashed passwords), with college selection at sign-up
- Notices with title, description, category, priority (Normal / Important / Urgent) and an optional PDF/image attachment (Cloudinary)
- Urgent notices pinned at the top, important notices highlighted
- Search, category filter, priority filter, "load more" pagination
- Comments on notices (authors can delete their own; the faculty who posted the notice can delete any comment on it)
- Faculty dashboard: create, edit, delete notices, see comment counts
- Profile page, responsive layout, toast messages, confirm dialogs

## How college isolation works

- The JWT only carries the user id. On every request the user (including `collegeId` and `role`) is re-loaded from MongoDB.
- Every notice and comment query uses `collegeId: req.user.collegeId`. A `collegeId` sent by the browser is never read.
- A notice or comment from another college returns **404**, exactly as if it did not exist.
- Faculty can only edit or delete notices they created in their own college (403 otherwise).
- Comments are stored with `noticeId`, `userId` and `collegeId`; reading, posting and deleting all re-check the college.

## Project structure

```
digital-college-notice-board/
├── client/                 React + Vite + Tailwind CSS
│   └── src/ components, pages, services, context, routes, utils
└── server/                 Express + Mongoose
    ├── config/  controllers/  middleware/  models/  routes/  utils/
    └── server.js
```

## Run locally

Requirements: Node.js 18+, a MongoDB database (local or free MongoDB Atlas), and optionally a free Cloudinary account.

```bash
# 1. install everything
npm install              # installs the helper that runs both apps together
npm run install:all      # installs server + client packages

# 2. configure the server
cp server/.env.example server/.env
#    then edit server/.env  (MONGO_URI, JWT_SECRET, Cloudinary keys)

# 3. add colleges (users pick one while registering)
npm run seed

# 4. start API (http://localhost:5000) and web app (http://localhost:5173)
npm run dev
```

Open http://localhost:5173, register as a faculty member, publish a notice, then register a student in the same college.
Register a second user in a different college to confirm they cannot see each other's notices.

**Adding your own colleges:** edit the list in `server/utils/seedColleges.js` and run `npm run seed` again (safe to repeat).

### Environment variables (`server/.env`)

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `JWT_EXPIRES_IN` | Token lifetime, default `7d` |
| `CLIENT_URL` | Allowed frontend origin(s), comma-separated (only needed when hosted separately) |
| `FACULTY_INVITE_CODE` | Optional. If set, faculty must enter this code to register (stops students from signing up as faculty) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Attachment uploads. Files go to `digital-college-notice-board/notices`. The secret stays on the server. |

The app works without Cloudinary; only attaching files is disabled until the keys are added.

## Deploy

### Option A: one service (simplest) on Render / Railway

The Express server automatically serves the built React app, so a single service is enough.

- **Build command:** `npm run build`
- **Start command:** `npm start`
- **Environment variables:** `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, Cloudinary keys (and optionally `FACULTY_INVITE_CODE`)
- Leave `VITE_API_URL` and `CLIENT_URL` empty. After the first deploy, run the seed once (from the platform shell, or locally with your production `MONGO_URI`): `npm run seed`

### Option B: separate frontend and backend

- **Backend** (Render/Railway): root directory `server`, build `npm install`, start `npm start`. Set `CLIENT_URL` to your frontend URL.
- **Frontend** (Vercel/Netlify): root directory `client`, build `npm run build`, output `dist`. Set `VITE_API_URL` to `https://<your-api-domain>/api`.
  SPA rewrites are already included (`client/vercel.json`, `client/public/_redirects`).

### MongoDB Atlas checklist

Create a free cluster, add a database user, allow network access (`0.0.0.0/0` for a hosted API), and copy the connection string into `MONGO_URI`.

## API summary

| Method | Endpoint | Who |
| --- | --- | --- |
| POST | `/api/auth/register`, `/api/auth/login` | public |
| GET | `/api/auth/me`, PUT `/api/auth/profile` | logged in |
| GET | `/api/colleges` | public |
| GET | `/api/notices` (`search`, `category`, `priority`, `mine`, `page`, `limit`) | logged in, own college only |
| GET | `/api/notices/:id` | logged in, own college only |
| POST / PUT / DELETE | `/api/notices`, `/api/notices/:id` | faculty, own notices |
| GET / POST | `/api/notices/:id/comments` | logged in, own college only |
| DELETE | `/api/comments/:id` | comment author or the notice's faculty owner |

## Notes

- Passwords are hashed with `bcryptjs` (pure-JS bcrypt), which installs reliably on every host without native compilation.
- Cloudinary free accounts can block public delivery of PDFs by default. If a PDF link fails to open, enable
  "Allow delivery of PDF and ZIP files" in Cloudinary Settings > Security.
