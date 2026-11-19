# Northstar authentication

A responsive React authentication interface backed by an Express API with Mongoose, MongoDB user storage, bcrypt password hashing, and JWT sessions in HttpOnly cookies.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

1. From `007-Day`, install dependencies:

   ```sh
   npm install
   ```

2. Copy `backend/.env.example` to `backend/.env`, set `JWT_SECRET` to a unique random value of at least 32 characters, and configure `MONGO_URI` for a MongoDB instance.
3. Start the frontend and API:

   ```sh
   npm run dev
   ```

4. Open the Vite URL shown in the terminal (normally `http://localhost:5173`). Configure `backend/.env` with `MONGO_URI` and `JWT_SECRET`; the Express API runs on port 4000 by default.

For production, build the frontend and start the API with `npm run build` and `npm start`. The API serves the built frontend on the same origin. Set `NODE_ENV=production` to enable secure cookies behind HTTPS.

## API

- `POST /api/auth/register` — create an account and start a session (`name`, `email`, `password`)
- `POST /api/auth/login` — authenticate and start a session (`email`, `password`)
- `POST /api/auth/logout` — clear the session cookie
- `GET /api/auth/me` — return the signed-in user's public profile

Passwords are never included in API responses. The JWT is kept in an HttpOnly, SameSite=Lax cookie rather than browser storage.

## Checks

```sh
npm test
npm run build
```
