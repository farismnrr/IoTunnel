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
const admin = createAuthentication(config);

const editAccessToken = async () => {
    const accessToken = await admin.auth.EditAdminToken(refreshToken.value);
    switch (accessToken.status) {
        case "fail":
            await deleteAccessToken();
            break;
        case "success":
            authStore.setAccessTokenAdmin(accessToken.data.access_token);
            accessToken.value = authStore.getAccessTokenAdmin();
            break;
    }
};

const deleteAccessToken = async () => {
    const accessToken = await admin.auth.DeleteAdminToken(refreshToken.value);
    switch (accessToken.status) {
        case "fail":
            navigateTo(externalLinks.value.dasboard);
            break;
        case "success":
            authStore.deleteAccessTokenAdmin();
            Cookies.remove("refreshTokenAdmin");
            navigateTo(externalLinks.value.signIn);
            break;
    }
};

onMounted(async () => {
    const rawEncryptedValue = Cookies.get("refreshTokenAdmin");
    const encryptedValue = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*=).[A-Z0-9a-z=]+$/.test(
        rawEncryptedValue ?? ""
    )
        ? rawEncryptedValue
        : Cookies.remove("refreshTokenAdmin");
    const decryptedValue = decode(encryptedValue ?? "");
    const finalValue = decrypt(decryptedValue);
    refreshToken.value = finalValue;
    accessToken.value = authStore.getAccessTokenAdmin();

    if (!refreshToken.value) {
        authStore.deleteAccessTokenAdmin();
        navigateTo(externalLinks.value.signIn);
        return;
    }

    const profile = createProfile(config);
    const adminResponse = await profile.getData.getAdminProfile(accessToken.value);
    switch (adminResponse.status) {
        case "fail":
            await editAccessToken();
            break;
        case "success":
            break;
    }
});

const externalLinks = ref({
    home: "/",
    signUp: "/admins/auth/signup",
    signIn: "/admins/auth/signin",
    dasboard: "/admins/dashboard"
});
</script>

<template></template>
