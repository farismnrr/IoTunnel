<script setup lang="ts">
import { useAuthStore } from "@/stores/pinia";
import { useRuntimeConfig } from "#app";
import TokenService from "@/composables/service/tokenService";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const tokenService = TokenService(config);
const accessToken = authStore.getAccessTokenAdmin();

const logout = async () => {
    await tokenService.deleteAdminToken();
    navigateTo("/admins/signin");
};

onMounted(async () => {
    await tokenService.updateAdminToken();
});
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center">Dashboard</h1>
        <p class="text-sm sm:text-base md:text-lg lg:text-xl mb-4 text-center break-all">
            Access Token: {{ accessToken }}
        </p>
        <button
            @click.prevent="logout"
            class="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 text-sm sm:text-base"
        >
            Logout
        </button>
    </div>
</template>
