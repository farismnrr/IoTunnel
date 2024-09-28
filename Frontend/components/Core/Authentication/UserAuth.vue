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
            await deleteAccessToken();
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
            navigateTo(externalLinks.value.signIn);
            break;
    }
};

onMounted(async () => {
    const rawEncryptedValue = Cookies.get("refreshTokenUser");
    const encryptedValue = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*=).[A-Z0-9a-z=]+$/.test(
        rawEncryptedValue ?? ""
    )
        ? rawEncryptedValue
        : Cookies.remove("refreshTokenUser");
    const decryptedValue = decode(encryptedValue ?? "");
    const finalValue = decrypt(decryptedValue);
    refreshToken.value = finalValue;
    accessToken.value = authStore.getAccessTokenUser();

    if (!refreshToken.value) {
        authStore.deleteAccessTokenUser();
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
    dasboard: "/users/dashboard"
});
</script>

<template></template>
