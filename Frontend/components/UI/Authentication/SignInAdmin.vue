<script setup lang="ts">
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import createVerification from "~/composables/Verification";
import createAuthentication from "~/composables/Authentication";

import Cookies from "js-cookie";
import { encode } from "js-base64";
import { encrypt } from "~/composables/Encryption";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const verification = createVerification(config);
const authentication = createAuthentication(config);

const data = ref({
    toastOptions: {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000
    },
    formData: {
        email: "",
        password: "",
        otp: ""
    },
    isLoading: false,
    icons: {
        loading:
            "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    },
    internalLinks: {
        home: "/",
        signUp: "/admins/auth/signup",
        dasboard: "/admins/dashboard",
        resetPassword: "#"
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
        otpLabel: "OTP (Email Verification)",
        sendOtpButton: "Send OTP",
        sendingOtpButton: "Sending...",
        signInButton: "Sign in",
        unexpectedError: "Unexpected error",
        otpSentSuccess: "OTP sent successfully",
        unexpectedResponse: "Unexpected response",
        errorSendingOtp: "An error occurred while sending OTP"
    }
});

const sendOtp = async () => {
    data.value.isLoading = true;
    try {
        const otpResponse = await verification.otp.sendOtpAdmin(data.value.formData.email);
        switch (otpResponse.status) {
            case "fail":
                toast.error(
                    otpResponse.errors ?? data.value.text.unexpectedError,
                    data.value.toastOptions
                );
                break;
            case "success":
                toast.success(data.value.text.otpSentSuccess, data.value.toastOptions);
                break;
            default:
                toast.info(data.value.text.unexpectedResponse, data.value.toastOptions);
        }
    } catch (error) {
        toast.error(data.value.text.errorSendingOtp, data.value.toastOptions);
    } finally {
        data.value.isLoading = false;
    }
};

const signin = async () => {
    const signinResponse = await authentication.signin.signinAdmin({
        email: data.value.formData.email,
        password: data.value.formData.password,
        otpCode: data.value.formData.otp
    });
    switch (signinResponse.status) {
        case "fail":
            toast.error(
                signinResponse.errors ?? data.value.text.unexpectedError,
                data.value.toastOptions
            );
            break;
        case "success":
            authStore.setAccessTokenAdmin(signinResponse.data?.access_token ?? "");
            const encryption1 = encrypt(signinResponse.data?.refresh_token ?? "");
            const encryption2 = encode(encryption1);
            Cookies.set("refreshTokenAdmin", encryption2, {
                sameSite: "strict",
                expires: 7,
                secure: true
            });

            navigateTo(data.value.internalLinks.dasboard);
            break;
        default:
            toast.info(data.value.text.unexpectedResponse, data.value.toastOptions);
    }
};

const accessTokenAdmin = computed(() => authStore.accessTokenAdmin);
onMounted(() => {
    if (accessTokenAdmin.value) {
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
                    <div class="grid grid-cols-[65%_32%] gap-3">
                        <div class="flex flex-col">
                            <label class="font-medium">{{ data.text.otpLabel }}</label>
                            <input
                                type="text"
                                v-model="data.formData.otp"
                                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <div class="flex flex-col">
                            <button
                                @click.prevent="sendOtp"
                                type="submit"
                                :disabled="data.isLoading"
                                class="w-full mt-7 px-3 py-3 text-white font-medium bg-primary-600 hover:bg-primary-500 active:bg-primary-600 rounded-lg duration-150 flex items-center justify-center"
                            >
                                <span v-if="!data.isLoading">{{ data.text.sendOtpButton }}</span>
                                <span v-else class="flex items-center">
                                    <svg
                                        class="animate-spin h-5 w-5 mr-3 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            class="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            stroke-width="4"
                                        ></circle>
                                        <path
                                            class="opacity-75"
                                            fill="currentColor"
                                            :d="data.icons.loading"
                                        ></path>
                                    </svg>
                                    {{ data.text.sendingOtpButton }}
                                </span>
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        @click.prevent="signin"
                        class="w-full px-4 py-2 text-white font-medium bg-primary-600 hover:bg-primary-500 active:bg-primary-600 rounded-lg duration-150"
                    >
                        {{ data.text.signInButton }}
                    </button>
                </form>
            </div>
        </div>
    </section>
</template>
