<script setup lang="ts">
import Cookies from "js-cookie";
import { decode } from "js-base64";
import { decrypt } from "~/composables/Encryption";
import { useAuthStore } from "~/stores/auth";
import { useRuntimeConfig } from "#app";
import createProfile from "~/composables/Profile";
import createAuthentication from "~/composables/Authentication";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const refreshToken = ref("");
const accessToken = ref("");
const user = createAuthentication(config);

const editAccessToken = async () => {
    const accessToken = await user.auth.EditUserToken(refreshToken.value);
    switch (accessToken.status) {
        case "fail":
            authStore.deleteAccessTokenUser();
            Cookies.remove("refreshTokenUser");
            navigateTo(externalLinks.value.signIn);
            break;
        case "success":
            authStore.setAccessTokenUser(accessToken.data.access_token);
            accessToken.value = authStore.getAccessTokenUser();
            break;
    }
};

const deleteAccessToken = async () => {
    const accessToken = await user.auth.DeleteUserToken(refreshToken.value);
    switch (accessToken.status) {
        case "fail":
            navigateTo(externalLinks.value.dasboard);
            break;
        case "success":
            authStore.deleteAccessTokenUser();
            Cookies.remove("refreshTokenUser");
            navigateTo(externalLinks.value.home);
            break;
    }
};

const logout = async () => {
    await deleteAccessToken();
};

onMounted(async () => {
    const encryptedValue = Cookies.get("refreshTokenUser");
    const decryptedValue = decode(encryptedValue ?? "");
    const finalValue = decrypt(decryptedValue);
    refreshToken.value = finalValue;
    accessToken.value = authStore.getAccessTokenUser();

    if (!refreshToken.value) {
        navigateTo(externalLinks.value.signIn);
        return;
    }

    const profile = createProfile(config);
    const userResponse = await profile.getData.getUserProfile(accessToken.value);
    switch (userResponse.status) {
        case "fail":
            await editAccessToken();
            break;
        case "success":
            break;
    }
});

const externalLinks = ref({
    home: "/",
    signUp: "/users/auth/signup",
    signIn: "/users/auth/signin",
    dasboard: "/test"
});
</script>

<template>
    <div>
        <h1>Access Token: {{ accessToken }}</h1>
        <h1>Refresh Token: {{ refreshToken }}</h1>
        <button
            @click.prevent="logout"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
            Logout
        </button>
    </div>
</template>
