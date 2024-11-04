<script setup lang="ts">
const data = ref({
    formData: {
        email: "",
        password: "",
        otp: ""
    },
    isLoading: false,
    internalLinks: {
        home: "/",
        signUp: "/admins/signup",
        signIn: "/admins/signin",
        dasboard: "/admins/dashboard",
        resetPassword: "#"
    },
    text: {
        loginTitle: "Log in to your account",
        noAccount: "Don't have an account?",
        signUp: "Sign up",
        emailLabel: "Email",
        passwordLabel: "Password",
        otpLabel: "OTP (Email Verification)",
        sendOtpButton: "Send OTP",
        signInButton: "Sign in",
        sending: "Sending...",
        forgotPassword: "Forgot password?"
    }
});

import VerificationService from "@/composables/service/verificationService";
import AuthenticationService from "@/composables/service/authenticationService";
import TokenService from "@/composables/service/tokenService";
import { useAuthStore } from "@/stores/pinia";
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const tokenService = TokenService(data.value.internalLinks.signIn, config);
const sendOtpButton = async () => {
    data.value.isLoading = true;
    const verificationService = VerificationService(config);
    try {
        await verificationService.validateSendOtpAdminRegister(data.value.formData.email);
    } catch (error) {
        console.error("Error sending OTP:", error);
    } finally {
        data.value.isLoading = false;
    }
};

const signinButton = async () => {
    const authenticationService = AuthenticationService(data.value.internalLinks.dasboard, config);
    await authenticationService.adminLogin({
        email: data.value.formData.email,
        password: data.value.formData.password,
        otp_code: data.value.formData.otp
    });
};

onMounted(async () => {
    try {
        await tokenService.updateAdminToken();
    } finally {
        if (authStore.accessTokenAdmin) {
            navigateTo(data.value.internalLinks.dasboard);
            return;
        }
    }
});
</script>

<template>
    <section
        class="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white to-primary-100 sm:px-4"
    >
        <div class="w-full space-y-6 text-gray-600 sm:max-w-md mb-5">
            <div class="text-center">
                <NuxtLink :to="data.internalLinks.home">
                    <img src="/icons/logo.svg" width="150" class="mx-auto" />
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
                                @click.prevent="sendOtpButton"
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
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    {{ data.text.sending }}
                                </span>
                            </button>
                        </div>
                    </div>
                    <button
                        @click.prevent="signinButton"
                        type="submit"
                        class="w-full px-4 py-2 text-white font-medium bg-primary-600 hover:bg-primary-500 active:bg-primary-600 rounded-lg duration-150"
                    >
                        {{ data.text.signInButton }}
                    </button>
                </form>
            </div>
            <div class="text-center">
                <NuxtLink :to="data.internalLinks.resetPassword" class="hover:text-primary-600">
                    {{ data.text.forgotPassword }}
                </NuxtLink>
            </div>
        </div>
    </section>
</template>
