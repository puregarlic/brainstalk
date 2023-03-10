# Brainstalk

Brainstalk is a self-hosted ingestion system for your knowledgebase. It's built
using [Fresh](fresh-docs) and designed to be hosted on
[Deno Deploy](deno-deploy) and backed by an [Upstash Redis](upstash-redis)
instance.

## Features

- REST API for saving text from anywhere
- ~~Editor plugin for your favorite knowledgebase~~

## Deploying Your Own Instance

Coming soon, once I've finished a feature

## Running Locally

You can run the server locally using `deno task start`.

## Configuration

_All environment variables listed below are required._

### Backend

- `UPSTASH_REDIS_REST_URL`: Provided by Upstash for your instance
- `UPSTASH_REDIS_REST_TOKEN`: Provided by Upstash for your instance

### Authentication

When connecting to the API, you'll use HTTP Basic Authentication using these
values, so make sure you generate them securely and store them somewhere safe.

- `BRAINSTALK_USERNAME`
- `BRAINSTALK_PASSWORD`

## Resources

- [Fresh documentation](fresh-docs)
- [TailwindCSS documentation](https://tailwindcss.com/)
- [Deno Deploy](deno-deploy)
- [Upstash Redis](upstash-redis)
- [CodeSandbox Projects — Docs](https://codesandbox.io/docs/projects)
- [CodeSandbox — Discord](https://discord.gg/Ggarp3pX5H)

[fresh-docs]: https://fresh.deno.dev/
[deno-deploy]: https://deno.com/deploy
[upstash-redis]: https://docs.upstash.com/redis
