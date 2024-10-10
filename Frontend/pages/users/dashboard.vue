<script setup lang="ts">
import { useRuntimeConfig } from "#app";
import PricingPlan from "@/components/UI/Dashboard/Users/PricingPlan.vue";
import TokenService from "@/composables/service/tokenService";

const data = ref({
    internalLink: {
        signin: "/users/signin",
        dashboard: "/users/dashboard"
    }
});

const config = useRuntimeConfig();
const tokenService = TokenService(data.value.internalLink.signin, config);

const logout = async () => {
    await tokenService.deleteUserToken();
};

onMounted(async () => {
    await tokenService.updateUserToken();
});
</script>

<template>
    <PricingPlan />
    <div class="flex flex-col items-center justify-center min-h-screen p-4">
        <button
            @click.prevent="logout"
            class="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 text-sm sm:text-base"
        >
            Logout
        </button>
    </div>
</template>
