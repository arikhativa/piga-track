Use two shared packages: @piga/db and @piga/contracts. Keep Supabase at repository root.
Execution plan for the next agent
Goal
Convert this repository into a small pnpm workspace:
Frontend and backend share one Drizzle schema.
Frontend and backend share Zod request/response schemas and inferred types.
Supabase functions retain their Deno dependency configuration.
No Nx, Turborepo, package publishing, or shared-library build pipeline.
Target layout
piga-track/
├── apps/
│ └── web/
│ ├── src/ # Existing frontend, excluding db/
│ ├── public/ # Icons and manifest
│ ├── index.html
│ ├── package.json
│ ├── tsconfig.json
│ ├── vite.config.ts
│ ├── components.json
│ └── tsr.config.json
├── packages/
│ ├── db/
│ │ ├── package.json
│ │ ├── tsconfig.json
│ │ └── src/
│ │ ├── schema.ts
│ │ └── types.ts
│ └── contracts/
│ ├── package.json
│ ├── tsconfig.json
│ ├── tests/
│ └── src/
│ ├── dashboard-data.ts
│ ├── get-transaction-data.ts
│ ├── create-import-batch.ts
│ └── import-row-action.ts
├── scripts/
│ └── db/
│ ├── seed.ts
│ └── seed-user.ts
├── supabase/
│ ├── config.toml
│ ├── migrations/ # Existing SQL and meta/, unchanged
│ └── functions/
│ ├── _shared/
│ │ ├── helper.ts
│ │ └── types.ts
│ └── ...existing functions/ # Each retains deno.json/deno.lock
├── .zed/
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── drizzle.config.ts
├── tsconfig.tools.json
└── biome.json

1. Record baseline and prove Deno sharing first
   Inspect Git status. Preserve all existing user changes.
   Run current frontend typecheck and build. Record pre-existing failures.
   Before moving the entire app, prove one function can import a shared source module from packages/.
   Test with the installed Supabase CLI, not only TypeScript or Deno.
   Gate: local serving and Supabase bundling must resolve the shared module and its npm dependencies.
   Do not assume pnpm symlinks or workspace:* will work in deployed functions. If external source imports fail, resolve that boundary before bulk moves. Do not create hand-maintained schema copies.
   Do not deploy to production for this test. Use an authorized preview project or report remote deployment validation as unavailable.
2. Create pnpm packages
   Add workspace entries while preserving existing allowBuilds:
   packages:

- "apps/*"
- "packages/*"
  Create private ESM packages named:
  @piga/web
  @piga/db
  @piga/contracts
  Preserve the current root packageManager pin and unrelated dependency versions.
  Dependency ownership:
  Web: browser dependencies and shared workspace dependencies.
  DB: drizzle-orm.
  Contracts: zod.
  Root: Supabase CLI, Drizzle Kit, shared tooling, and dependencies directly imported by seed scripts.
  Declare dependencies wherever directly imported. Do not rely on hoisting.
  Use source TypeScript exports. Vite, tsx, and Deno should consume those sources without building libraries.

3. Extract the canonical Drizzle schema
   Move src/db/schema.ts into packages/db/src/schema.ts.
   Expose explicit package subpaths:
   @piga/db/schema: Drizzle tables, enums, constants, and existing exports.
   @piga/db/types: type-only exports derived from that schema.
   Typical frontend usage:
   import type { Transaction, Currency } from "@piga/db/types";
   Backend usage:
   import { transaction, currency } from "@piga/db/schema";
   Keep connections, environment access, credentials, and seed execution outside the shared DB package.
   Move seeds into scripts/db/. Replace frontend aliases in those scripts with appropriate package or relative imports.
   Update root Drizzle config:
   schema: "./packages/db/src/schema.ts",
   out: "./supabase/migrations",
   Do not change schema definitions, generate new database changes, rename migrations, or recreate migration metadata.
4. Extract shared API contracts
   Move the Zod schemas from these existing files into matching contract modules:
   supabase/functions/dashboard-data/schema.ts
   supabase/functions/get-transaction-data/schema.ts
   supabase/functions/create-import-batch/schema.ts
   supabase/functions/import-row-action/schema.ts
   Expose matching package subpaths, for example:
   import {
   dashboardRequestSchema,
   dashboardResponseSchema,
   } from "@piga/contracts/dashboard-data";
   Each module should export:
   Request schema.
   Request input type using z.input.
   Parsed request type using z.output, where defaults or transforms matter.
   Success-response schema and inferred response type.
   Dashboard and transaction-data already have response schemas. Define missing response schemas from actual serialized responses, not guesses.
   Preserve existing response envelopes:
   Create-import-batch returns { batch, rows }.
   Import-row-action returns { data: result }.
   Keep contracts browser-safe: no DB clients, secrets, Deno, or environment access.
   Do not equate database records with HTTP payloads blindly. JSON timestamps are strings; preserve existing numeric/string representations.
5. Connect Deno imports explicitly
   Keep each function’s deno.json.
   Map shared package names directly to source files. Example additions for dashboard-data/deno.json:
   {
   "imports": {
   "@piga/db/schema": "../../../packages/db/src/schema.ts",
   "@piga/db/types": "../../../packages/db/src/types.ts",
   "@piga/contracts/dashboard-data": "../../../packages/contracts/src/dashboard-data.ts"
   }
   }
   Merge these into existing imports; do not replace unrelated mappings.
   Use explicit .ts extensions for relative imports inside shared packages.
   Align dependency versions:
   Keep Drizzle at 0.45.2.
   Pin Zod consistently across pnpm and Deno.
   Use 4.6.1, already present in existing function locks.
   Refresh locks through their package managers.
   Current Deno locks resolve Zod inconsistently: some use 4.5.4, others 4.6.1.
   Do not introduce a root Deno workspace as a substitute for function deployment configuration.
6. Move frontend and replace duplicated types
   Move frontend files and configuration into apps/web.
   Preserve local #/* and @/* aliases. Update app-owned paths, asset locations, and generator configuration.
   Replace:
   Existing #/db/schema imports with shared DB imports.
   Copied types in these frontend helpers with contract imports:
   src/lib/dashboard/getDashboardData.ts
   src/lib/transaction/getTransactionData.ts
   src/lib/importer/createImportBatch.ts
   src/lib/importer/importRowAction.ts
   Retain authoritative backend request validation.
   Use shared schemas for frontend request validation and successful-response parsing. Handle Supabase invocation errors before parsing responses.
   Malformed successful responses should throw a clear contract error. Valid payload behavior and existing fields must remain unchanged.
   Do not redesign endpoints, authorization, business logic, or UI behavior.
7. Update root tooling, editor, and deployment configuration
   Preserve root developer commands:
   pnpm dev, build, preview, and route generation delegate to web.
   Existing database commands remain rooted beside supabase/.
   db:seed runs the relocated seed script from repository root.
   check:ts checks web, shared packages, and Node tooling.
   Add check:functions for all four functions using their own Deno configs.
   Update Biome coverage for the new directories.
   Configure Zed for frontend/tooling TypeScript and function Deno support. Do not switch the whole repository to Deno.
   Document environment locations:
   Node database tooling loads root environment files.
   Vite now loads app-local environment files by default.
   Never expose database credentials through VITE_*.
   Do not print or commit existing secrets.
   For Render:
   Keep build root at repository root so workspace packages remain available.
   Build with pnpm install --frozen-lockfile && pnpm build.
   Publish apps/web/dist.
   Preserve the SPA rewrite.
   Build filters must include shared packages and root dependency/configuration files.
   Keep production migrations separate from frontend builds.
8. Tests and acceptance criteria
   Use existing tsx with node:test for contract tests. No additional test framework needed.
   Cover:
   Valid and invalid requests.
   Optional/defaulted fields, especially transaction filter arrays.
   Existing response envelopes.
   Serialized timestamps and numeric values.
   Representative responses for all four endpoints.
   Run:
   pnpm install --frozen-lockfile
   pnpm check:ts
   pnpm check:functions
   pnpm check
   pnpm test
   pnpm build
   Also:
   Smoke-test all four functions locally using non-production fixtures.
   Verify frontend routes and assets.
   Confirm schema extraction produces no migration changes, using a disposable copy if generation is needed.
   Confirm no function imports frontend source.
   Confirm no manually duplicated DB or API types remain.
   Confirm browser output contains no database client or credentials.
   Report existing failures separately from regressions.
   Document commands, package ownership, and verified Supabase deployment behavior in README.
   Deliverable: working workspace, focused tests, updated documentation, and exact validation results. No commit or production deployment unless requested.
