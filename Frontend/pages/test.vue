<script setup lang="ts">
import axios from "axios";
import { useRuntimeConfig } from "#app";
const config = useRuntimeConfig();

async function getUrlSIgnin(owner: string): Promise<string> {
    const url = `${config.public.apiUrl}/${owner}`;
    return url;
}

const user = ref<any | null>(null);

async function getUser() {
    try {
        const url = await getUrlSIgnin("users");
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${config.public.apiSecret}`
            }
        });
        user.value = response.data;
    } catch (error: any) {
        const response = error.response;
        return response.data;
    }
}

const logout = async () => {
    navigateTo("/");
};

onMounted(async () => {
    await getUser();
});
</script>

<template>
    <div>
        <h1>You are logged in</h1>
        <h2>User Data:</h2>
        <p>{{ user }}</p>
        <button
            @click.prevent="logout"
            type="submit"
            class="px-4 py-2 text-white font-medium bg-primary-600 hover:bg-primary-500 active:bg-primary-600 rounded-lg duration-150"
        >
            Logout
        </button>
    </div>
</template>
