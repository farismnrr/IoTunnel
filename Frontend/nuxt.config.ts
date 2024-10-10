// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    runtimeConfig: {
        public: {
            apiSecret: process.env.API_SECRET,
            apiUrl: `${process.env.API_URL}/api/${process.env.API_VERSION}`,
            privateKey: process.env.PRIVATE_KEY,
            publicKey: process.env.PUBLIC_KEY,
            midtrans: {
                clientKey: process.env.MIDTRANS_CLIENT_KEY,
                snapUrl: process.env.MIDTRANS_SNAP_URL
            }
        }
    },
    nitro: {
        routeRules: {
            "/api/**": { cors: true, headers: { "access-control-allow-methods": "GET,HEAD,PUT,PATCH,POST,DELETE" } }
        },
        preset: "bun"
    },
    modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "pinia-plugin-persistedstate/nuxt"],
    ssr: true
});
