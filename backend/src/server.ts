import { env } from "./config/env.js";
import { prisma } from "./data/prisma.js";
import { createApp } from "./app.js";

const app = createApp();
const server = app.listen(env.PORT, () => {
  console.log(`Sports Connect API listening on http://localhost:${env.PORT}`);
});

const shutdown = async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
