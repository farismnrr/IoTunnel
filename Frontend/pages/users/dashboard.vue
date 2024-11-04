<script setup lang="ts">
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "@/stores/pinia";
import PricingPlan from "@/components/UI/Dashboard/Users/PricingPlan.vue";
import MobileBar from "@/components/UI/Dashboard/Users/MobileBar.vue";
import WebBar from "@/components/UI/Dashboard/Users/WebBar.vue";

import TokenService from "@/composables/service/tokenService";
import SubscriptionService from "@/composables/service/subscriptionService";

const data = ref({
    internalLink: {
        signin: "/users/signin",
        dashboard: "/users/dashboard"
    },
    hasSubscription: false,
    isLoading: true
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const tokenService = TokenService(data.value.internalLink.signin, config);
const subscriptionService = SubscriptionService(data.value.internalLink.dashboard, config);

onMounted(async () => {
    try {
        await tokenService.updateUserToken();
    } finally {
        if (!authStore.accessTokenUser) {
            navigateTo(data.value.internalLink.signin);
            return;
        }
    }
    try {
        const subscription = await subscriptionService.getSubscription();
        data.value.hasSubscription = !!subscription;
    } finally {
        data.value.isLoading = false;
    }
});
</script>

<template>
    <section>
        <PricingPlan v-if="data.hasSubscription === false && !data.isLoading" />
        <LoadingIndicator v-else-if="data.isLoading" />
    </section>
    <section class="hidden md:block">
        <WebBar />
    </section>
    <section class="md:hidden">
        <MobileBar />
    </section>
</template>
