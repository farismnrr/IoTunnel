// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    runtimeConfig: {
        public: {
            apiSecret: process.env.API_SECRET,
            apiUrl: `${process.env.API_URL}/api/${process.env.API_VERSION}`
        }
    },
    modules: ["@nuxtjs/tailwindcss", "@nuxt/eslint", "@pinia/nuxt"]
});
