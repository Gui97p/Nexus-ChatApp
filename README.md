# Nexus ChatApp

Backend for a chat application built with Fastify, TypeScript, and Prisma. A portfolio project focused on modular architecture and server-side performance.

---

## Stack

- **Fastify** — chosen for its native route schema typing, which is much more ergonomic than Express when working with TypeScript
- **TypeScript + Prisma** — end-to-end type safety from HTTP all the way to the database, eliminating an entire category of runtime bugs
- **Docker Compose** — spins up both the API and database together, no local setup needed
- **Vitest** — fast tests, natively integrated with the project's ecosystem

---

## Structure

```
├── prisma/          # Schema and migrations
├── src/
│   ├── routes/      # Fastify routes
│   ├── controllers/ # HTTP layer
│   ├── services/    # Business logic
│   ├── utils/
│   └── tests/
├── docker-compose.yml
└── Dockerfile
```

The split between controllers and services is intentional — controllers only deal with HTTP, services handle logic. Each layer is easier to test and extend independently.

---

## Getting started

​```bash
git clone https://github.com/Gui97p/chatapp.git
cd chatapp
npm install
cp .env.example .env  # fill in DATABASE_URL, JWT_SECRET, etc.
```

**With Docker (recommended):**
```bash
docker compose up --build
```

**Without Docker** (with a local database already running):
```bash
npm run dev
```

---

## Tests

```bash
npm test
```

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Check code style |
| `npm run format` | Format with Prettier |
| `npm test` | Run tests with Vitest |

---

## License

MIT
