import { basicAuth } from "https://deno.land/x/basic_auth@v1.1.1/mod.ts";
import { MiddlewareHandler } from "$fresh/server.ts";

export const handler: MiddlewareHandler = (req, ctx) => {
  const username = Deno.env.get("BRAINSTALK_USERNAME");
  const password = Deno.env.get("BRAINSTALK_PASSWORD");

  if (!username || !password) {
    throw new Error(
      "No credentials are defined! Make sure to set BRAINSTALK_USERNAME and BRAINSTALK_PASSWORD in your deployment environment variables",
    );
  }

  return basicAuth(req, "Brainstalk API", {
    [username]: password ?? "",
  }) ?? ctx.next();
};
