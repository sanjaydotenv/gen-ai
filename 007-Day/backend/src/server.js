import "dotenv/config";
import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error(
    "Set JWT_SECRET in your environment to a random value of at least 32 characters.",
  );
}

await connectDatabase(process.env.MONGO_URI);

const app = createApp({
  jwtSecret,
  cookieSecure: process.env.NODE_ENV === "production",
});

const port = Number(process.env.PORT) || 4000;
const server = app.listen(port, () => {
  console.log(`Authentication server listening on http://localhost:${port}`);
});

let shuttingDown = false;
async function shutdown() {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
