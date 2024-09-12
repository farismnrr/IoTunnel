// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	modules: [
		"@nuxtjs/tailwindcss",
		"@nuxt/eslint",
		[
			"@nuxtjs/google-fonts",
			{
				families: {
					Roboto: true,
				},
			},
		],
		"@nuxtjs/sitemap",
	],
	runtimeConfig: {
		apiSecret: process.env.API_SECRET,
		public: {
			apiUrl: process.env.API_URL,
			apiVersion: process.env.API_VERSION,
		},
	},
	site: {
		url: "https://www.iotunnel.cloud",
		name: "IoTunnel (All in one IoT Platform)",
		defaultLocale: "en",
	},
});
