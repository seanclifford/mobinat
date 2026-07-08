import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	return {
		base: env.VITE_BASE_PATH,
		plugins: [react(), legacy({ targets: ["defaults", "not IE 11"] })],
		host: process.env.VITE_SERVER_HOST,
		preview: {
			headers: {
				"content-security-policy":
					"default-src 'self';" +
					"style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com;" +
					"img-src 'self' *.inaturalist.org https://inaturalist-open-data.s3.amazonaws.com;" +
					"font-src https://fonts.gstatic.com;" +
					"connect-src 'self' *.inaturalist.org",
			},
		},
		build: {
			sourcemap: true,
			chunkSizeWarningLimit: 650,
			rolldownOptions: {
				output: {
					codeSplitting: {
						groups: [
							{
								name: "react-vendor",
								test: /node_modules[\\/]react/,
								priority: 20,
							},
							{
								name: "mantine-vendor",
								test: /node_modules[\\/]@mantine/,
								priority: 30,
							},
							{
								name: "vendor",
								test: /node_modules/,
							},
						],
					},
				},
			},
		},
	};
});
