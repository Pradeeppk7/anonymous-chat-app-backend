# REST vs GraphQL Performance Analysis

This document provides a practical performance analysis of the Anonymous Group Chat API across its REST and GraphQL interfaces.

## Scope

The comparison focuses on the same backend system:

- Express REST API
- Apollo GraphQL API
- Prisma ORM
- PostgreSQL
- Shared service layer

Because both interfaces reuse the same service layer and database, the main performance differences come from request shape, response shape, and GraphQL execution overhead rather than business logic differences.

## Summary

For this project:

- REST is generally more efficient for fixed, simple operations
- GraphQL is more efficient when clients need flexible field selection or multiple related objects in one request
- REST has lower server-side parsing and execution overhead
- GraphQL can reduce over-fetching and client round trips
- GraphQL can become slower than REST if nested resolvers are not optimized

## Architecture Impact on Performance

Both APIs ultimately call the same services:

- REST controller -> service -> Prisma -> PostgreSQL
- GraphQL resolver -> service -> Prisma -> PostgreSQL

That means database latency is shared across both approaches. The extra cost in GraphQL comes from:

- parsing the GraphQL query
- validating the query against the schema
- executing resolver trees
- serializing nested response structures

REST avoids this schema execution layer, so for straightforward endpoints it is usually faster and lighter.

## Endpoint-by-Endpoint Comparison

### 1. Create Group

REST:

- `POST /api/groups`
- direct controller call
- minimal request parsing

GraphQL:

- `createGroup(name)`
- includes GraphQL parse and execution overhead

Expected result:

- REST should be slightly faster for pure create operations

Reason:

- both use the same database write path
- GraphQL adds overhead without reducing database work

### 2. Send Message

REST:

- `POST /api/groups/:groupCode/messages`

GraphQL:

- `sendMessage(groupCode, nickname, content)`

Expected result:

- REST should again be slightly faster for the mutation itself

Reason:

- same validation and persistence logic
- GraphQL adds resolver execution overhead

### 3. List Messages

REST:

- `GET /api/groups/:groupCode/messages`
- always returns the fixed message payload

GraphQL:

- `messages(groupCode)` with client-selected fields

Expected result:

- REST is faster when the client always needs the full response
- GraphQL can be more efficient over the network if the client requests only a small subset of fields

Reason:

- REST returns a fixed shape
- GraphQL can reduce response size and client-side filtering

### 4. Group with Nested Messages

REST:

- requires multiple calls in many clients
- one call for group details
- one call for group messages

GraphQL:

- one query can request group plus nested messages

Expected result:

- GraphQL can outperform REST from the client perspective because it reduces round trips

Reason:

- fewer HTTP requests
- one response can contain exactly the needed shape

Risk:

- nested GraphQL resolution can become inefficient if each nested field triggers extra queries

In this project:

- the `Group.messages` resolver issues a query for messages per group
- for a single group query this is acceptable
- for larger multi-group nested queries, a dataloader or batching strategy would be better

## REST Strengths in This Project

- Lower protocol and execution overhead
- Simpler monitoring and debugging
- Predictable response shape
- Better fit for admin actions and simple mutations
- Easier caching at HTTP layer

Examples where REST is likely the better choice here:

- create group
- send message
- delete message
- delete group
- list reports for moderation dashboards with fixed fields

## GraphQL Strengths in This Project

- Flexible field selection
- Reduced over-fetching
- Better fit for dashboards or custom clients
- Ability to fetch related data in a single request

Examples where GraphQL is likely the better choice here:

- group detail views that need group data and messages together
- admin panels that need tailored result shapes
- clients with varying data requirements across screens

## Current Performance Risks

### 1. N+1 Query Risk

The current GraphQL resolver design is service-oriented and clean, but nested queries can still create extra database calls.

Example:

```graphql
query {
  groups {
    id
    name
    messages {
      id
      content
    }
  }
}
```

Potential issue:

- one query to fetch groups
- one additional query per group to fetch messages

Impact:

- performance degrades as the number of groups increases

Recommended fix:

- add DataLoader or batched message loading by `groupId`

### 2. No Pagination Yet

Message-heavy groups can return large payloads.

Impact:

- slower response times
- more memory use
- unnecessary bandwidth usage

Recommended fix:

- add pagination for REST message listing
- add cursor-based pagination for GraphQL

### 3. No Response Caching

Frequently requested read endpoints currently always hit the database.

Impact:

- avoidable database load

Recommended fix:

- add short-lived caching for read-heavy endpoints
- optionally use Redis or in-memory cache for non-critical reads

## Expected Practical Outcome

For this application, the likely practical outcome is:

- REST performs better for write-heavy operations and fixed-response endpoints
- GraphQL provides a better client experience for complex read patterns
- the raw latency difference is usually smaller than the database/network latency
- poor GraphQL resolver design would hurt performance more than GraphQL itself

## Optimization Strategies

To improve both APIs:

1. Add pagination to message and admin list endpoints
2. Add indexes for high-frequency filtering patterns as usage grows
3. Introduce DataLoader for GraphQL nested resolvers
4. Cache read-heavy admin/report endpoints where appropriate
5. Add request logging and timing metrics
6. Run load tests against representative scenarios

## Suggested Benchmark Methodology

To convert this qualitative analysis into measured results:

1. Seed the database with realistic data
   - 100 groups
   - 10,000 messages
   - 1,000 reports
2. Compare equivalent REST and GraphQL operations
3. Measure:
   - average response time
   - p95 latency
   - payload size
   - requests per second
   - database query count
4. Use a tool such as:
   - k6
   - autocannon
   - Postman performance runner
5. Test these cases:
   - create group
   - send message
   - list messages
   - fetch group with nested messages
   - list reports

## Conclusion

In this project, REST is the better performer for simple, fixed operations, while GraphQL is the better interface for flexible, relationship-heavy reads. Since both APIs share the same service layer, the main optimization opportunities are not in business logic duplication but in query batching, pagination, and caching.
