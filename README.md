# WorkHub Admin

Admin UI for WorkHub (users, roles, permissions, account, sessions).

## Architecture

- **Vue 3**, **TypeScript**, **Vite**, **Pinia**, **Vue Router**, **Tailwind CSS**, **Axios**.
- **`features/`** — screens and stores; **`app/`** — router and providers; **`shared/`**, **`widgets/`** — API client and layout.
- Same API routing model as **WorkHub Web**: **`/api`** → nginx proxy → backend **`/v1/...`**.

## Environment variables

### `.env` — Docker runtime (container)

| Key | Example value | Notes |
|-----|----------------|--------|
| `API_HOST` | `host.docker.internal` | API host from inside the container |
| `API_PORT` | `3000` | API port |

`docker-compose.yml` sets `extra_hosts` for Linux (`host.docker.internal`).

### `.env` — local dev (Vite, optional)

| Key | Example value | Notes |
|-----|----------------|--------|
| `VITE_API_BASE_URL` | `/api` | Same default in `Dockerfile` |
| `VITE_API_VERSION` | `v1` | Same default in `Dockerfile` |
| `VITE_API_PROXY_TARGET` | `http://localhost:3000` | Dev server proxy only |

## Run with Docker

```bash
docker compose up -d --build
```

- **App:** `http://localhost` (port **80** mapped to container 80)

Ensure the API is running and allows your origin in `CORS_ORIGINS`.

Stop:

```bash
docker compose down
```
