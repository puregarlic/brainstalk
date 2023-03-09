import { Handlers } from "$fresh/server.ts";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const handler: Handlers = {
  async GET(_req: Request) {
    const keys = await redis.keys("");
    const vals = await redis.mget<string[]>(...keys);

    const out = new Map<string, string>();
    for (let i = 0; i < keys.length; i++) {
      out.set(keys[i], vals[i]);
    }

    return new Response(
      JSON.stringify(Object.fromEntries(out.entries())),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },
  async POST(req: Request) {
    let block: unknown;

    try {
      const body = await req.json();
      block = body?.block;
    } catch (e) {
      console.error(e);
      return new Response(
        JSON.stringify({ error: "Failed to parse body as JSON" }),
        { status: 400 },
      );
    }

    if (!block) {
      return new Response(
        JSON.stringify({ error: "Body must contain `block` key" }),
        { status: 400 },
      );
    } else if (typeof block !== "string") {
      return new Response(
        JSON.stringify({ error: "`block` must be a string" }),
        { status: 400 },
      );
    }

    await redis.set(crypto.randomUUID(), block);

    return new Response(null, {
      status: 204,
    });
  },
};
