# Secure Notes (frontend)
Next.js (App Router) + Tailwind + Axios. Minimal UI. Token is kept in localStorage (tradeoff: an httpOnly cookie would be safer against XSS).

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev                  # http://localhost:3000
```
Pages: /login, /register, /notes (CRUD + pagination), /posts, /interests, /admin/users, /admin/notes.
Deploy on Vercel with `NEXT_PUBLIC_API_URL` set to the live API URL (ending in `/api`).
# jobtask-frontend
