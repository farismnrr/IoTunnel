<script setup lang="ts">
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import createAuthentication from "~/composables/Authentication";

import Cookies from "js-cookie";
import { encode } from "js-base64";
import { encrypt } from "~/composables/Encryption";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const authentication = createAuthentication(config);

const data = ref({
    toastOptions: {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000
    },
    formData: {
        email: "",
        password: ""
    },
    icons: {
        googleIcon:
            "https://raw.githubusercontent.com/sidiDev/remote-assets/7cd06bf1d8859c578c2efbfda2c68bd6bedc66d8/google-icon.svg"
    },
    internalLinks: {
        home: "/",
        signUp: "/users/auth/signup",
        dasboard: "/users/dashboard",
        resetPassword: "#",
        signWithGoogle: "#"
    },
    logo: {
        iconLogo: "/icons/logo.svg"
    },
    text: {
        loginTitle: "Log in to your account",
        noAccount: "Don't have an account?",
        signUp: "Sign up",
        emailLabel: "Email",
        passwordLabel: "Password",
        signInButton: "Sign in",
        forgotPassword: "Forgot password?",
        orContinueWith: "Or continue with",
        unexpectedError: "Unexpected error",
        unexpectedResponse: "Unexpected response"
    }
});

const signin = async () => {
    const signinResponse = await authentication.signin.signinUser({
        email: data.value.formData.email,
        password: data.value.formData.password
    });
    switch (signinResponse.status) {
        case "fail":
            toast.error(
                signinResponse.errors ?? data.value.text.unexpectedError,
                data.value.toastOptions
            );
            break;
        case "success":
            authStore.setAccessTokenUser(signinResponse.data?.access_token ?? "");
            const encryption1 = encrypt(signinResponse.data?.refresh_token ?? "");
            const encryption2 = encode(encryption1);
            Cookies.set("refreshTokenUser", encryption2, {
                sameSite: "strict",
                expires: 7,
                secure: true,
                path: "/"
            });

            navigateTo(data.value.internalLinks.dasboard);
            break;
        default:
            toast.info(data.value.text.unexpectedResponse, data.value.toastOptions);
    }
};

const accessTokenUser = computed(() => authStore.accessTokenUser);
onMounted(() => {
    if (accessTokenUser.value) {
        navigateTo(data.value.internalLinks.dasboard);
    }
});
</script>

<template>
    <section
        class="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white to-primary-100 sm:px-4"
    >
        <div class="w-full space-y-6 text-gray-600 sm:max-w-md">
            <div class="text-center">
                <NuxtLink :to="data.internalLinks.home">
                    <img :src="data.logo.iconLogo" width="150" class="mx-auto" />
                </NuxtLink>
                <div class="mt-5 space-y-2">
                    <h3 class="text-gray-800 text-2xl font-bold sm:text-3xl">
                        {{ data.text.loginTitle }}
                    </h3>
                    <p class="">
                        {{ data.text.noAccount }}
                        <NuxtLink
                            :to="data.internalLinks.signUp"
                            class="font-medium text-primary-500 hover:text-primary-400"
                        >
                            {{ data.text.signUp }}
                        </NuxtLink>
                    </p>
                </div>
            </div>
            <div class="bg-white shadow p-4 py-6 space-y-8 sm:p-6 sm:rounded-lg">
                <div class="grid grid-cols-1 gap-x-3">
                    <NuxtLink
                        :to="data.internalLinks.signWithGoogle"
                        class="flex items-center justify-center py-2.5 border rounded-lg hover:bg-gray-50 duration-150 active:bg-gray-100"
                    >
                        <img :src="data.icons.googleIcon" alt="Google" class="w-5 h-5" />
                    </NuxtLink>
                </div>
                <div class="relative">
                    <span class="block w-full h-px bg-gray-300"></span>
                    <p
                        class="inline-block w-fit text-sm bg-white px-2 absolute -top-2 inset-x-0 mx-auto"
                    >
                        {{ data.text.orContinueWith }}
                    </p>
                </div>
                <form class="space-y-5">
                    <div>
                        <label class="font-medium">{{ data.text.emailLabel }}</label>
                        <input
                            type="email"
                            v-model="data.formData.email"
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label class="font-medium">{{ data.text.passwordLabel }}</label>
                        <input
                            type="password"
                            v-model="data.formData.password"
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <button
                        @click.prevent="signin"
                        type="submit"
                        class="w-full px-4 py-2 text-white font-medium bg-primary-600 hover:bg-primary-500 active:bg-primary-600 rounded-lg duration-150"
                    >
                        {{ data.text.signInButton }}
                    </button>
                </form>
            </div>
            <div class="text-center mb-5">
                <NuxtLink :to="data.internalLinks.resetPassword" class="hover:text-primary-600">
                    {{ data.text.forgotPassword }}
                </NuxtLink>
            </div>
        </div>
    </section>
</template>
