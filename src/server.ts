import dotenv from "dotenv";
import http from "http";

import { createApp } from "./app";
import { initializeSocket } from "./websocket/socket";

dotenv.config();

const PORT = Number(process.env.PORT ?? 4000);

async function bootstrap() {
  const app = await createApp();
  const server = http.createServer(app);

  initializeSocket(server);

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Anonymous Group Chat API listening on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server", error);
  process.exit(1);
});
