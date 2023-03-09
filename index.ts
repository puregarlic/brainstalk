import { Server } from "std/http/server.ts";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const port = 8080;
const handler = (_request: Request) => {
  const body = `Hello from Deno on CodeSandbox`;

  return new Response(body, { status: 200 });
};

const server = new Server({ port, handler });

console.log("server listening on http://localhost:8080");

await server.listenAndServe();
