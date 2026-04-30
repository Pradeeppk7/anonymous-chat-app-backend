# Anonymous Group Chat API

Backend-only application for anonymous text chat groups. Users can create groups, join via a group code, send anonymous messages, and report problematic content. Admin endpoints support moderation by listing groups and reports, soft deleting messages, and deactivating groups.

## Project Overview

- Stack: Node.js, Express, TypeScript, PostgreSQL, Prisma, Apollo Server, Socket.io
- Interfaces: REST API, GraphQL API, WebSocket events, OpenAPI YAML
- Database target: Neon PostgreSQL via `DATABASE_URL`
- Deployment-ready for Render with Neon as the managed database

## Architecture

The application follows a layered structure:

- Controllers handle HTTP requests and responses
- Services contain business logic and validation
- Prisma manages database access
- GraphQL resolvers reuse the same service layer used by REST
- Socket.io handles room-based real-time delivery for group chats
- Middleware centralizes 404 and error responses

Project structure:

```text
anonymous-chat-backend/
├── .github/workflows/ci.yml
├── src/
│   ├── controllers/
│   ├── graphql/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── websocket/
│   ├── app.ts
│   └── server.ts
├── prisma/schema.prisma
├── openapi.yaml
├── README.md
├── .env.example
├── tsconfig.json
└── package.json
```

## Database Schema Explanation

### `Group`

- `id`: integer primary key
- `groupCode`: unique code users share to join the chat
- `name`: human-readable group name
- `isActive`: marks whether the group is still available
- `createdAt`: creation timestamp

### `Message`

- `id`: integer primary key
- `groupId`: foreign key to `Group`
- `nickname`: anonymous nickname supplied by sender
- `content`: message body
- `isDeleted`: soft delete flag for moderation
- `createdAt`: creation timestamp

### `Report`

- `id`: integer primary key
- `messageId`: foreign key to `Message`
- `reason`: why the message was reported
- `status`: moderation workflow status, default `pending`
- `createdAt`: creation timestamp

### `AdminAction`

- `id`: integer primary key
- `actionType`: action performed, such as `delete`
- `targetType`: target resource type, such as `message` or `group`
- `targetId`: target record id
- `reason`: moderator note
- `createdAt`: action timestamp

## REST API Explanation

Base URL: `http://localhost:4000`

Endpoints:

- `POST /api/groups`: create a group and generate a unique group code
- `GET /api/groups/:groupCode`: fetch group details
- `GET /api/groups/:groupCode/messages`: list non-deleted messages in an active group
- `POST /api/groups/:groupCode/messages`: create a message in an active group
- `POST /api/messages/:messageId/reports`: report a message
- `GET /api/admin/groups`: list all groups
- `GET /api/admin/reports`: list all reports
- `DELETE /api/admin/messages/:messageId`: soft delete a message
- `DELETE /api/admin/groups/:groupId`: deactivate a group

Admin endpoints are now protected by HTTP Basic auth. Use the credentials configured in `.env`:

- `ADMIN_USERNAME=admin`
- `ADMIN_PASSWORD=admin123`

Error handling:

- `400` for validation errors
- `404` for missing or inactive resources
- `500` for unexpected server failures

## GraphQL Explanation

GraphQL endpoint:

- `POST /graphql`

Schema includes:

- Types: `Group`, `Message`, `Report`
- Queries: `groups`, `group(groupCode)`, `messages(groupCode)`, `reports`
- Mutations: `createGroup`, `sendMessage`, `reportMessage`, `deleteMessage`, `deleteGroup`

Resolvers are intentionally thin and call the same service-layer functions used by the REST controllers.

Example mutation:

```graphql
mutation {
  sendMessage(groupCode: "AB12CD34", nickname: "SilentFox", content: "Hello everyone") {
    id
    content
    createdAt
  }
}
```

## REST vs GraphQL Performance Analysis

A dedicated comparison is available in [`performance-analysis.md`](./performance-analysis.md).

High-level conclusion:

- REST is generally faster for fixed, simple operations such as create, delete, and basic list endpoints
- GraphQL is more flexible for complex reads because clients can fetch only the fields they need
- both APIs share the same service and database layer, so the biggest differences come from GraphQL execution overhead and response flexibility
- the main future optimization area is GraphQL nested query batching to avoid N+1 query patterns

## WebSocket Explanation

Socket.io is attached to the same HTTP server as Express.

Supported events:

- `joinGroup`: join a room whose name is the `groupCode`
- `leaveGroup`: leave that room
- `sendMessage`: persist a message and broadcast it
- `newMessage`: emitted to everyone in the room after a message is saved
- `errorMessage`: emitted when a socket message fails validation or persistence

Example client flow:

1. Connect to the Socket.io server.
2. Emit `joinGroup` with the target `groupCode`.
3. Emit `sendMessage` with `groupCode`, `nickname`, and `content`.
4. Listen for `newMessage`.

## OpenAPI Usage

The REST API specification lives in [`openapi.yaml`](./openapi.yaml).

Use it with Swagger UI locally:

1. Start the backend.
2. Open `http://localhost:4000/docs` for embedded Swagger UI.
3. Or fetch `GET /openapi.yaml` and import it into Swagger Editor, Postman, or other API tooling.

> Note: deployment to Azure App Service was not possible in this environment due to Azure subscription policy restrictions blocking the chosen resource configuration.

## GitHub Actions Explanation

The CI workflow is defined in [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

It does the following on push and pull request:

- checks out the repository
- sets up Node.js 20
- installs dependencies
- runs `prisma generate`
- runs the TypeScript build

## Setup Steps

1. Install Node.js 20 or newer.
2. Create a Neon PostgreSQL database.
3. Copy `.env.example` to `.env`.
4. Set `DATABASE_URL` to your Neon connection string.
5. Install dependencies:

```bash
npm install
```

6. Generate Prisma client:

```bash
npm run prisma:generate
```

7. Push the schema to the database or create a migration:

```bash
npm run prisma:push
```

## Run Locally

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

Useful URLs:

- REST health check: `GET /health`
- GraphQL: `POST /graphql`
- GraphQL Playground: `GET /playground`
- Swagger UI: `GET /docs`
- OpenAPI YAML: `GET /openapi.yaml`

## Deployment Steps (Neon + Render)

### Neon

1. Create a Neon project and database.
2. Copy the pooled or direct PostgreSQL connection string.
3. Add it to Render as `DATABASE_URL`.

### Render

1. Create a new Web Service connected to your repository.
2. Set the runtime to Node.
3. Set the build command:

```bash
npm install && npm run prisma:generate && npm run build
```

4. Set the start command:

```bash
npm start
```

5. Add environment variables:

- `DATABASE_URL`
- `PORT` if you want to override Render's default
- `CORS_ORIGIN` for your allowed client origin

6. Deploy the service.

For schema updates after deployment, run `npx prisma db push` or a migration job against the Neon database.
