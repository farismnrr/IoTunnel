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
const admin = createAuthentication(config);

const data = ref({
    refreshToken: "",
    accessToken: "",
    internalLinks: {
        home: "/",
        signUp: "/admins/auth/signup",
        signIn: "/admins/auth/signin",
        dasboard: "/admins/dashboard"
    }
});

const editAccessToken = async () => {
    const accessToken = await admin.auth.EditAdminToken(data.value.refreshToken);
    switch (accessToken.status) {
        case "fail":
            await deleteAccessToken();
            break;
        case "success":
            authStore.setAccessTokenAdmin(accessToken.data.access_token);
            data.value.accessToken = authStore.getAccessTokenAdmin();
            break;
    }
};

const deleteAccessToken = async () => {
    const accessToken = await admin.auth.DeleteAdminToken(data.value.refreshToken);
    switch (accessToken.status) {
        case "fail":
            navigateTo(data.value.internalLinks.dasboard);
            break;
        case "success":
            authStore.deleteAccessTokenAdmin();
            Cookies.remove("refreshTokenAdmin");
            navigateTo(data.value.internalLinks.signIn);
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
    data.value.refreshToken = finalValue;
    data.value.accessToken = authStore.getAccessTokenAdmin();

    if (!data.value.refreshToken) {
        authStore.deleteAccessTokenAdmin();
        navigateTo(data.value.internalLinks.signIn);
        return;
    }

    const profile = createProfile(config);
    const adminResponse = await profile.getData.getAdminProfile(data.value.accessToken);
    switch (adminResponse.status) {
        case "fail":
            await editAccessToken();
            break;
        case "success":
            break;
    }
});
</script>

<template>
    <div></div>
</template>
