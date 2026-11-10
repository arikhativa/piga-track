import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
	server: { host: "0.0.0.0" },
	resolve: { tsconfigPaths: true },
	plugins: [devtools(), tailwindcss(), viteReact()],
});

export default config;
