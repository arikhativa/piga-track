# Piga Track

A private pnpm workspace with shared TypeScript source packages. No library build or publishing step is required.

## Package ownership

- `apps/web` (`@piga/web`): React/Vite frontend, browser dependencies, app configuration, and public icons/manifest.
- `packages/db` (`@piga/db`): canonical Drizzle schema and schema-derived types; depends on Drizzle ORM `0.45.2`.
- `packages/contracts` (`@piga/contracts`): browser-safe Zod `4.6.1` request/response schemas and inferred input/output types.
- Repository root: Supabase CLI, Drizzle Kit, shared tooling, and dependencies imported by Node seed scripts.
- `scripts/db`: Node database seeds, executed from the repository root.
- `supabase`: local configuration, existing migrations/metadata, and Deno edge functions.

Shared package exports point directly to TypeScript sources. Vite and tsx resolve workspace exports. Each edge function retains its own `deno.json` and `deno.lock`; its import map points shared package names directly to `../../../packages/...` sources and maps npm dependencies explicitly. Functions do not depend on pnpm workspace symlinks or frontend source.

Use `@piga/db/schema` for tables/constants and `@piga/db/types` for type-only imports. Shared contracts expose `@piga/contracts/dashboard-data`, `@piga/contracts/get-transaction-data`, `@piga/contracts/create-import-batch`, and `@piga/contracts/import-row-action`. Request input types retain optional/defaulted fields; parsed types describe Zod output. HTTP timestamps are strings, and decimal representations follow existing endpoint responses. The import endpoints retain `{ batch, rows }` and `{ data: result }`.

## Root commands

| Command                | Purpose                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `pnpm dev`             | Run the web app on port 3000                                            |
| `pnpm build`           | Build the web app into `apps/web/dist`                                  |
| `pnpm preview`         | Preview the web build                                                   |
| `pnpm generate-routes` | Run route generation from `apps/web`                                    |
| `pnpm check:ts`        | Check web, both shared packages, contract tests, and Node tooling       |
| `pnpm check:functions` | Check all four function entrypoints using their individual Deno configs |
| `pnpm check`           | Run Biome over configured workspace files                               |
| `pnpm test`            | Run contract tests through tsx and `node:test`                          |
| `pnpm functions`       | Serve local Supabase functions                                          |
| `pnpm db:seed`         | Run `scripts/db/seed.ts` from the repository root                       |

Existing `db:*` commands remain rooted beside `supabase/`. Drizzle uses `packages/db/src/schema.ts` and writes to `supabase/migrations`. Production migrations remain a separate, explicit operation; frontend builds never apply them.

## Environment and editor

Node database tooling loads root environment files. Drizzle loads `.env` by default and `.env.prod` when `DRIZZLE_ENV=prod`; seeds use root `.env`. Keep database URLs and service-role credentials here, never in browser variables.

Vite now runs from `apps/web` and loads app-local environment files by default, such as `apps/web/.env.local`. Move only the frontend's required public configuration into those files. Any `VITE_*` value is public browser configuration: never put database credentials or service-role keys there. Existing environment files were not read or moved during this migration.

Zed retains frontend/tooling TypeScript support through vtsls and enables Deno only for `supabase/functions`. Install/enable the Deno extension and Deno runtime for function support. Each function's own Deno configuration remains authoritative. Root `tsconfig.json` selects Node tooling; the app and shared packages have separate configs.

## Render

`render.yaml` configures a static site with the repository root as its build root. The build is `pnpm install --frozen-lockfile && pnpm build`, publication is `apps/web/dist`, and all routes rewrite to `/index.html` for SPA navigation. Workspace packages and root dependency/configuration files participate in build filters. Configure public Vite environment values in Render; do not add database secrets. Do not set the Render root directory to `apps/web` because shared sources must remain available.

## Validation status and remaining work

This migration was performed with file tools only, as requested. No Git status, installs, baseline typechecks, tests, builds, Deno checks, Supabase CLI serving/bundling, deployment, or migration generation ran. Existing failures cannot be distinguished from regressions without a baseline. Static source inspection is not runtime validation.

**Lockfiles are intentionally unchanged and stale.** Regenerate `pnpm-lock.yaml` through pnpm and each function's `deno.lock` through Deno before using frozen-lockfile installation or deployment. Do not hand-edit resolved dependency metadata. A fresh frozen install is not expected to succeed until lockfiles match the new package manifests and pinned Zod version.

When command execution is permitted, first refresh locks through their package managers. Then run:

```sh
pnpm install --frozen-lockfile
pnpm check:ts
pnpm check:functions
pnpm check
pnpm test
pnpm build
```

Supabase shared-source import resolution and npm dependency bundling have **not been verified** with the installed CLI. Locally serve and smoke-test all four functions with non-production fixtures, including valid/error requests and their original response envelopes. If the CLI cannot bundle source imports outside `supabase/functions`, resolve that boundary without creating schema copies. No production deployment is authorized; remote preview validation is unavailable in this file-only pass.

Also verify frontend deep links and icon/manifest URLs, inspect the browser output for database clients/credentials, and confirm schema extraction produces no migration changes. Existing SQL and migration metadata were left untouched; use a disposable copy if generation is needed for verification.

Contract tests cover requests, defaults, response envelopes, serialized timestamps, and numeric representations. They were added but not executed.

## Original setup notes

shadcn --preset b6ae1bIzA
pnpm dlx shadcn@latest init --preset b6ae1bIzA --base radix --template vite --rtl --pointer

# Shadcn Admin kit

more supabase code:
https://github.com/marmelab/ra-supabase/blob/main/packages/ra-supabase-core/src/useResetPassword.ts
