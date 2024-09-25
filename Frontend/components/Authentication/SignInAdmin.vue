<script setup lang="ts">
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import createVerification from "~/composables/Verification";
import createAuthentication from "~/composables/Authentication";

const authStore = useAuthStore();
const config = useRuntimeConfig();
const verification = createVerification(config);
const authentication = createAuthentication(config);

const toastOptions = {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 1000
};

const formData = ref({
    email: "",
    password: "",
    otp: ""
});
const isLoading = ref(false);

const sendOtp = async () => {
    isLoading.value = true;
    try {
        const otpResponse = await verification.otp.sendOtpAdmin(formData.value.email);
        switch (otpResponse.status) {
            case "fail":
                toast.error(otpResponse.errors ?? "Unexpected error", toastOptions);
                break;
            case "success":
                toast.success("OTP sent successfully", toastOptions);
                break;
            default:
                toast.info("Unexpected response", toastOptions);
        }
    } catch (error) {
        toast.error("An error occurred while sending OTP", toastOptions);
    } finally {
        isLoading.value = false;
    }
};

const signin = async () => {
    const signinResponse = await authentication.signin.signinAdmin({
        email: formData.value.email,
        password: formData.value.password,
        otpCode: formData.value.otp
    });
    switch (signinResponse.status) {
        case "fail":
            toast.error(signinResponse.errors ?? "Unexpected error", toastOptions);
            break;
        case "success":
            authStore.setAccessTokenAdmin(signinResponse.data?.access_token ?? "");
            navigateTo(externalLinks.value.dasboard);
            break;
        default:
            toast.info("Unexpected response", toastOptions);
    }
};

const accessTokenAdmin = computed(() => authStore.accessTokenAdmin);
onMounted(() => {
    if (accessTokenAdmin.value) {
        navigateTo(externalLinks.value.dasboard);
    }
});

const externalLinks = ref({
    home: "/",
    signUp: "/admins/auth/signup",
    dasboard: "/test",
    resetPassword: "#"
});
</script>
<template>
    <section
        class="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white to-primary-100 sm:px-4"
    >
        <div class="w-full space-y-6 text-gray-600 sm:max-w-md">
            <div class="text-center">
                <NuxtLink :to="externalLinks.home">
                    <img src="/icons/logo.svg" width="150" class="mx-auto" />
                </NuxtLink>
                <div class="mt-5 space-y-2">
                    <h3 class="text-gray-800 text-2xl font-bold sm:text-3xl">
                        Log in to your account
                    </h3>
                    <p class="">
                        Don't have an account?
                        <NuxtLink
                            :to="externalLinks.signUp"
                            class="font-medium text-primary-500 hover:text-primary-400"
                        >
                            Sign up
                        </NuxtLink>
                    </p>
                </div>
            </div>
            <div class="bg-white shadow p-4 py-6 space-y-8 sm:p-6 sm:rounded-lg">
                <form class="space-y-5">
                    <div>
                        <label class="font-medium">Email</label>
                        <input
                            type="email"
                            v-model="formData.email"
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label class="font-medium">Password</label>
                        <input
                            type="password"
                            v-model="formData.password"
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div class="grid grid-cols-[65%_32%] gap-3">
                        <div class="flex flex-col">
                            <label class="font-medium">OTP (Email Verification)</label>
                            <input
                                type="text"
                                v-model="formData.otp"
                                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <div class="flex flex-col">
                            <button
                                @click.prevent="sendOtp"
                                type="submit"
                                :disabled="isLoading"
                                class="w-full mt-7 px-3 py-3 text-white font-medium bg-primary-600 hover:bg-primary-500 active:bg-primary-600 rounded-lg duration-150 flex items-center justify-center"
                            >
                                <span v-if="!isLoading">Send OTP</span>
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
                                    Sending...
                                </span>
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        @click.prevent="signin"
                        class="w-full px-4 py-2 text-white font-medium bg-primary-600 hover:bg-primary-500 active:bg-primary-600 rounded-lg duration-150"
                    >
                        Sign in
                    </button>
                </form>
            </div>
            <div class="text-center mb-5">
                <NuxtLink :to="externalLinks.resetPassword" class="hover:text-primary-600">
                    Forgot password?
                </NuxtLink>
            </div>
        </div>
    </section>
</template>
