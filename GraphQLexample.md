# Anonymous Group Chat API Test Examples

This file contains copy-paste examples to run and test the backend locally using REST, GraphQL, and WebSocket.

## Prerequisites

Make sure:

1. Your `.env` file contains a valid `DATABASE_URL`
2. Dependencies are installed
3. Prisma schema is pushed to the database

Commands:

```powershell
npm install
npm run prisma:push
npm run dev
```

Useful local URLs:

- Swagger UI: `http://localhost:4000/docs`
- GraphQL Playground: `http://localhost:4000/playground`
- GraphQL Endpoint: `http://localhost:4000/graphql`
- OpenAPI YAML: `http://localhost:4000/openapi.yaml`
- Health Check: `http://localhost:4000/health`

## REST API Examples

## 1. Create Group

```powershell
curl -X POST http://localhost:4000/api/groups `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Study Group\"}"
```

Example response:

```json
{
  "id": 1,
  "groupCode": "AB12CD34",
  "name": "Study Group",
  "isActive": true,
  "createdAt": "2026-04-30T05:00:00.000Z"
}
```

Save the returned `groupCode`. It will be used in the next requests.

## 2. Get Group Details

Replace `AB12CD34` with your real group code.

```powershell
curl http://localhost:4000/api/groups/AB12CD34
```

## 3. Send Message

```powershell
curl -X POST http://localhost:4000/api/groups/AB12CD34/messages `
  -H "Content-Type: application/json" `
  -d "{\"nickname\":\"Anon1\",\"content\":\"Hello everyone\"}"
```

Example response:

```json
{
  "id": 1,
  "groupId": 1,
  "nickname": "Anon1",
  "content": "Hello everyone",
  "isDeleted": false,
  "createdAt": "2026-04-30T05:05:00.000Z"
}
```

## 4. List Messages

```powershell
curl http://localhost:4000/api/groups/AB12CD34/messages
```

## 5. Report Message

Replace `1` with a real message id.

```powershell
curl -X POST http://localhost:4000/api/messages/1/reports `
  -H "Content-Type: application/json" `
  -d "{\"reason\":\"Spam\"}"
```

## 6. Admin List Groups

```powershell
curl http://localhost:4000/api/admin/groups
```

## 7. Admin List Reports

```powershell
curl http://localhost:4000/api/admin/reports
```

## 8. Admin Soft Delete Message

```powershell
curl -X DELETE http://localhost:4000/api/admin/messages/1 `
  -H "Content-Type: application/json" `
  -d "{\"reason\":\"Removed by admin\"}"
```

## 9. Admin Deactivate Group

```powershell
curl -X DELETE http://localhost:4000/api/admin/groups/1 `
  -H "Content-Type: application/json" `
  -d "{\"reason\":\"Closed by admin\"}"
```

## GraphQL Examples

Open:

```text
http://localhost:4000/playground
```

Important:

- `id` is not a root query field
- valid root query fields are `groups`, `group`, `messages`, and `reports`

## 1. Create Group

```graphql
mutation {
  createGroup(name: "Study Group") {
    id
    groupCode
    name
    isActive
    createdAt
  }
}
```

## 2. List Groups

```graphql
query {
  groups {
    id
    groupCode
    name
    isActive
    createdAt
  }
}
```

## 3. Get Group by Code

```graphql
query {
  group(groupCode: "AB12CD34") {
    id
    groupCode
    name
    isActive
    createdAt
    messages {
      id
      nickname
      content
      createdAt
    }
  }
}
```

## 4. Send Message

```graphql
mutation {
  sendMessage(
    groupCode: "AB12CD34"
    nickname: "Anon1"
    content: "Hello from GraphQL"
  ) {
    id
    groupId
    nickname
    content
    isDeleted
    createdAt
  }
}
```

## 5. List Messages

```graphql
query {
  messages(groupCode: "AB12CD34") {
    id
    nickname
    content
    createdAt
  }
}
```

## 6. Report Message

```graphql
mutation {
  reportMessage(messageId: 1, reason: "Spam") {
    id
    messageId
    reason
    status
    createdAt
  }
}
```

## 7. List Reports

```graphql
query {
  reports {
    id
    messageId
    reason
    status
    createdAt
  }
}
```

## 8. Delete Message

```graphql
mutation {
  deleteMessage(messageId: 1, reason: "Removed by admin") {
    id
    content
    isDeleted
  }
}
```

## 9. Delete Group

```graphql
mutation {
  deleteGroup(groupId: 1, reason: "Closed by admin") {
    id
    name
    isActive
  }
}
```

## Invalid vs Valid GraphQL Query

Invalid:

```graphql
query {
  id
}
```

Why invalid:

- `id` belongs to object types like `Group` and `Message`
- it is not defined directly on the `Query` type

Valid:

```graphql
query {
  groups {
    id
    name
    groupCode
  }
}
```

Also valid:

```graphql
query {
  group(groupCode: "AB12CD34") {
    id
    name
  }
}
```

## WebSocket Test Example

Socket.io events supported by the backend:

- `joinGroup`
- `leaveGroup`
- `sendMessage`
- `newMessage`
- `errorMessage`

Example client flow:

1. Connect to the socket server on `http://localhost:4000`
2. Emit `joinGroup` with the group code
3. Emit `sendMessage`
4. Listen for `newMessage`

Example payload:

```json
{
  "groupCode": "AB12CD34",
  "nickname": "Anon1",
  "content": "Hello from socket"
}
```

## Quick Test Order

Use this order for fastest testing:

1. Create a group
2. Copy the `groupCode`
3. Send a message
4. List messages
5. Report the message
6. View admin reports
7. Test GraphQL queries
8. Test Swagger UI
9. Test WebSocket events
