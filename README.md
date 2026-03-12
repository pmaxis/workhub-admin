# WorkHub Admin

Admin panel for managing WorkHub users, roles, permissions, personal account, and sessions.

## Tech Stack

- Vue 3 + TypeScript
- Vite
- Pinia
- Vue Router
- Axios
- Tailwind CSS

## Requirements

- Node.js 20+
- pnpm 10+

## Local Development

```bash
pnpm install
pnpm dev
```

By default, the app runs at `http://localhost:5173`.

## Build

```bash
pnpm build
pnpm preview
```

## Environment Variables

The admin app communicates with API through `axios` and a Vite dev proxy.

### Main Variables

- `VITE_API_BASE_URL` (frontend runtime base URL)
  - default: `/api`
- `VITE_API_PROXY_TARGET` (target for local Vite proxy)
  - default: `http://localhost:3000`

### `.env` Example

```env
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:3000
```

## How API Works in Dev Mode

- Frontend requests are sent to `/api/*`
- Vite proxies them to `VITE_API_PROXY_TARGET`
- For cookie-based auth, proxy rewrites `Set-Cookie Path=/` to `Path=/api/`
- If API is unavailable, proxy returns `503` with an error message

## Authentication and Access Control

- Login: `POST /auth/login` (via `/api/auth/login` in dev)
- Refresh: `POST /auth/refresh`
- Logout: `POST /auth/logout`
- Current user is resolved from access token payload (`userId`, `permissions`) + `GET /users/:id`
- Admin panel access requires `manage.all`
- User section access is additionally controlled by:
  - `users.read`
  - `users.create`
  - `users.update`
  - `users.delete`

## Main Pages

- `/login` — sign in
- `/` — dashboard
- `/users` — users list
- `/users/new`, `/users/:id/edit` — user form
- `/roles` — roles list
- `/roles/new`, `/roles/:id/edit` — role form
- `/permissions` — permissions list
- `/permissions/new`, `/permissions/:id/edit` — permission form
- `/my-account` — my account + sessions (`GET /sessions`, `DELETE /sessions/:id`)

## Project Structure

```text
src/
  app/              # router, providers
  entities/         # domain base types
  features/         # auth, users, roles, permissions, theme
  pages/            # route pages
  shared/           # api client, shared UI, constants
  widgets/          # layout/sidebar
```

## Notes

- Sessions are not mocked; list/delete operations use real API endpoints.
- The `My Account` dropdown item opens the account page.
- Profile editing fields are planned for a next iteration and are currently a placeholder.
