// import { drizzle } from "drizzle-orm/node-postgres";
// import { seed } from "drizzle-seed";
// import * as schema from "./schema.ts";

// async function main() {
// 	const db = drizzle(process.env.DATABASE_URL!);

// 	await seed(db, { users: schema.tra }).refine((f) => ({
// 		users: {
// 			columns: {
// 				name: f.fullName(),
// 			},
// 			count: 20,
// 		},
// 	}));
// }

// main();
