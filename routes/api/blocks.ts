import { Handlers } from "$fresh/server.ts";
import { Redis } from "@upstash/redis";
import { z } from "zod";

const redis = Redis.fromEnv();

const postSchema = z.object({
  block: z.string(),
});

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
    try {
      const body = await req.json();
      const block = postSchema.parse(body).block;

      try {
        await redis.set(crypto.randomUUID(), block);
      } catch (error) {
        console.error(error);
        return new Response("Failed to save block", {
          status: 500,
        });
      }

      return new Response(null, {
        status: 204,
      });
    } catch (error) {
      console.error(error);
      return new Response(error.message, {
        status: 400,
      });
    }
  },
};
