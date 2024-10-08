<template>
    <div>
        <h1>Cookie:</h1>
        <p>{{ tokenRef }}</p>
        <button
            @click.prevent="setCookie"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
            Set Cookie
        </button>
        <button
            @click.prevent="getCookie"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
            Get Cookie
        </button>
        <button
            @click.prevent="deleteCookie"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
            Delete Cookie
        </button>
    </div>
</template>

<script setup lang="ts">
import { useCookie } from "#imports";
import axios from "axios";

const token = useCookie("refreshTokenUser");
const tokenRef = ref(token.value || "");

const setCookie = async () => {
    try {
        await axios.post("/api/set-cookie", { token: "example-token" });
    } catch (error) {
        console.error("Error setting cookie:", error);
    }
};

const getCookie = async () => {
    try {
        const response = await axios.get("/api/get-cookie");
        console.log(response.data);
        tokenRef.value = response.data.token;
    } catch (error) {
        console.error("Error getting cookie:", error);
    }
};

const deleteCookie = async () => {
    try {
        await axios.get("/api/delete-cookie");
    } catch (error) {
        console.error("Error deleting cookie:", error);
    }
};
</script>
