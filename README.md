# Number Nexus

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/therealwilberk/numbernexus)

A production-ready full-stack chat application powered by Cloudflare Workers and Durable Objects. Features real-time chat boards, user management, and scalable storage using a single Global Durable Object with indexed entities. Built with React, TypeScript, shadcn/ui, and Tailwind CSS for a modern, responsive UI.

## Features

- **Real-time Chat**: Send and list messages in dedicated chat boards.
- **User Management**: CRUD operations for users with automatic indexing.
- **Durable Objects**: Efficient storage using one DO per entity, backed by a shared Global DO for atomic operations.
- **Indexed Listing**: Paginated lists of users and chats with cursor-based navigation.
- **Type-Safe APIs**: Shared types between frontend and worker for end-to-end type safety.
- **Modern UI**: Responsive design with shadcn/ui components, dark mode, and animations.
- **Error Handling**: Comprehensive error boundaries and API client error reporting.
- **Scalable**: Handles concurrent modifications with CAS (Compare-And-Swap) retries.

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, TanStack Query, shadcn/ui, Tailwind CSS, Lucide Icons
- **Backend**: Cloudflare Workers, Hono, Durable Objects
- **State & Data**: Immer, Zustand (extensible)
- **Utils**: clsx, tailwind-merge, Zod (validation ready)
- **Deployment**: Wrangler, Cloudflare Pages + Workers

## Quick Start

1. **Clone and Install**:
   ```bash
   git clone <your-repo-url>
   cd number-nexus-l8ug1hxkkac3obzrgj4rq
   bun install
   ```

2. **Run Locally**:
   ```bash
   bun dev
   ```
   Opens at `http://localhost:3000` (or `$PORT`).

3. **Type Generation** (for Workers env):
   ```bash
   bun run cf-typegen
   ```

## Local Development

- **Frontend**: Hot-reload with `bun dev`.
- **Worker**: Integrated via Vite proxy; APIs available at `/api/*`.
- **Database**: Uses Durable Objects storage (SQLite-backed in dev/prod).
- **Linting**: `bun lint`
- **Build**: `bun build` (produces `./dist` for deployment).

Seed data (users/chats) auto-loads on first API call.

### API Endpoints

All endpoints return `{ success: boolean, data?: T, error?: string }`.

- `GET /api/users?cursor=&limit=` - List users (paginated)
- `POST /api/users` - `{ name: string }` → Create user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/deleteMany` - `{ ids: string[] }`
- `GET /api/chats?cursor=&limit=` - List chats
- `POST /api/chats` - `{ title: string }` → Create chat
- `GET /api/chats/:chatId/messages` - List messages
- `POST /api/chats/:chatId/messages` - `{ userId: string, text: string }` → Send message
- `DELETE /api/chats/:id` - Delete chat
- `POST /api/chats/deleteMany` - `{ ids: string[] }`

Test with curl or UI.

## Deployment

Deploy to Cloudflare Workers + Pages in one command:

```bash
bun deploy
```

Or manually:

1. **Build Assets**:
   ```bash
   bun build
   ```

2. **Deploy Worker**:
   ```bash
   npx wrangler deploy
   ```

Assets (`dist/`) auto-serve as Pages SPA via `assets` config in `wrangler.jsonc`.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/therealwilberk/numbernexus)

**Custom Domain**: Update `wrangler.jsonc` and run `wrangler deploy`.

## Environment Variables

None required (Durable Objects handle all storage).

## Extending the App

- **New Entities**: Extend `IndexedEntity` in `worker/entities.ts`.
- **New Routes**: Add to `worker/user-routes.ts`; auto-loaded.
- **UI Components**: Use shadcn CLI or copy from `src/components/ui`.
- **Queries**: Leverage TanStack Query in React components.

## Scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Start dev server |
| `bun build` | Build for production |
| `bun lint` | Lint code |
| `bun preview` | Preview production build |
| `bun deploy` | Build + deploy |
| `bun cf-typegen` | Generate Worker types |

## License

MIT. Built with [Cloudflare Workers Boilerplate](https://developers.cloudflare.com/workers/).