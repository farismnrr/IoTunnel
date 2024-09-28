<script setup lang="ts">
import Cookies from "js-cookie";
import { decode } from "js-base64";
import { decrypt } from "~/composables/Encryption";
import { useAuthStore, useTokenStore } from "~/stores/auth";
import { useRuntimeConfig } from "#app";
import createProfile from "~/composables/Profile";
import createAuthentication from "~/composables/Authentication";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const tokenStore = useTokenStore();
const user = createAuthentication(config);

const data = ref({
    refreshToken: "",
    accessToken: "",
    internalLinks: {
        home: "/",
        signUp: "/users/auth/signup",
        signIn: "/users/auth/signin",
        dasboard: "/users/dashboard"
    }
});

const editAccessToken = async () => {
    const accessTokenResponse = await user.auth.EditUserToken(data.value.refreshToken);
    switch (accessTokenResponse.status) {
        case "fail":
            await deleteAccessToken();
            break;
        case "success":
            authStore.setAccessTokenUser(accessTokenResponse.data.access_token);
            data.value.accessToken = authStore.getAccessTokenUser();
            break;
    }
};

const deleteAccessToken = async () => {
    const accessTokenResponse = await user.auth.DeleteUserToken(data.value.refreshToken);
    switch (accessTokenResponse.status) {
        case "fail":
            navigateTo(data.value.internalLinks.dasboard);
            break;
        case "success":
            authStore.deleteAccessTokenUser();
            Cookies.remove("refreshTokenUser");
            navigateTo(data.value.internalLinks.signIn);
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
    data.value.refreshToken = finalValue;
    data.value.accessToken = authStore.getAccessTokenUser();
    tokenStore.setRefreshToken(data.value.refreshToken);

    if (!data.value.refreshToken) {
        authStore.deleteAccessTokenUser();
        navigateTo(data.value.internalLinks.signIn);
        return;
    }

    const profile = createProfile(config);
    const userResponse = await profile.getData.getUserProfile(data.value.accessToken);
    switch (userResponse.status) {
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
