import { Handlers } from "$fresh/server.ts";
import { Redis } from "@upstash/redis";
import { z } from "zod";

const redis = Redis.fromEnv();

const postSchema = z.object({
  text: z.string(),
});
const deleteSchema = z.object({
  ids: z.array(z.string()),
});

type Atom = {
  id: string;
  text: string;
};

export const handler: Handlers = {
  async GET(_req: Request) {
    const keys = await redis.keys("");

    if (!keys.length) {
      return new Response(
        JSON.stringify([]),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const vals = await redis.mget<string[]>(...keys);

    const out: Atom[] = [];
    for (let i = 0; i < keys.length; i++) {
      out.push({ id: keys[i], text: vals[i] });
    }

    return new Response(
      JSON.stringify(out.entries()),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },
  async POST(req: Request) {
    try {
      const body = await req.json();
      const text = postSchema.parse(body).text;

      try {
        const id = crypto.randomUUID();
        await redis.set(id, text);

        if (typeof BroadcastChannel !== "undefined") {
          new BroadcastChannel("messages").postMessage({
            type: "NEW",
            atom: {
              id,
              text,
            },
          });
        }
      } catch (error) {
        console.error(error);
        return new Response("Failed to save block", {
          status: 500,
        });
      }

      return new Response(null, { status: 204 });
    } catch (error) {
      console.error(error);
      return new Response(error.message, { status: 400 });
    }
  },
  async DELETE(req: Request) {
    try {
      const body = await req.json();
      const ids = deleteSchema.parse(body).ids;

      if (!ids.length) return new Response(null, { status: 204 });

      try {
        await redis.del(...ids);
      } catch (error) {
        console.error(error);
        return new Response("Failed to delete blocks", {
          status: 500,
        });
      }

      return new Response(null, { status: 204 });
    } catch (error) {
      console.error(error);
      return new Response(error.message, { status: 400 });
    }
  },
};
