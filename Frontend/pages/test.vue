<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { computed, onMounted } from "vue";

const authStore = useAuthStore();
const accessToken = computed(() => authStore.accessToken);

const logout = async () => {
    authStore.deleteAccessToken();
    navigateTo("/");
};

onMounted(() => {
    if (!accessToken.value) {
        navigateTo("/");
    }
});
</script>

<template>
    <div>
        <h1>You are logged in</h1>
        <h2>Access Token:</h2>
        <p>{{ accessToken }}</p>
        <button
            @click.prevent="logout"
            type="submit"
            class="px-4 py-2 text-white font-medium bg-primary-600 hover:bg-primary-500 active:bg-primary-600 rounded-lg duration-150"
        >
            Logout
        </button>
    </div>
</template>
