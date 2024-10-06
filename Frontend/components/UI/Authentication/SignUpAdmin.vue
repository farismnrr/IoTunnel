<script setup lang="ts">
const data = ref({
    formData: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        otp: "",
        adminKey: ""
    },
    isLoading: false,
    internalLinks: {
        home: "/",
        signIn: "/admins/signin",
        dashboard: "/admins/dashboard"
    },
    text: {
        createAccount: "Create an account",
        alreadyHaveAccount: "Already have an account?",
        logIn: "Log in",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        password: "Password",
        reEnterPassword: "Re-enter Password",
        adminKey: "Admin Key",
        otpLabel: "OTP (Email Verification)",
        sendOtp: "Send OTP",
        createAccountButton: "Create account",
        sending: "Sending..."
    }
});

import VerificationService from "~/composables/service/verificationService";

const verificationService = VerificationService();

const sendOtpButton = async () => {
    data.value.isLoading = true;
    try {
        await verificationService.validateSendOtpAdminRegister(data.value.formData.email);
    } catch (error) {
        console.error("Error sending OTP:", error);
    } finally {
        data.value.isLoading = false;
    }
};
const signupButton = async () => {};
</script>

<template>
    <section class="w-full min-h-screen bg-gradient-to-r from-primary-100 to-white sm:px-4 flex justify-center">
        <div class="w-full space-y-6 text-gray-600 sm:max-w-md mb-8">
            <div class="text-center">
                <NuxtLink :to="data.internalLinks.home">
                    <img src="/icons/logo.svg" width="150" class="mx-auto" />
                </NuxtLink>
                <div class="space-y-2">
                    <h3 class="text-gray-800 text-2xl font-bold sm:text-3xl">
                        {{ data.text.createAccount }}
                    </h3>
                    <p class="">
                        {{ data.text.alreadyHaveAccount }}
                        <NuxtLink
                            :to="data.internalLinks.signIn"
                            class="font-medium text-primary-500 hover:text-primary-400"
                        >
                            {{ data.text.logIn }}
                        </NuxtLink>
                    </p>
                </div>
            </div>
            <div class="bg-white shadow p-4 py-4 sm:p-6 sm:rounded-lg">
                <form class="space-y-5">
                    <div class="flex flex-col sm:flex-row gap-6">
                        <div class="flex flex-auto flex-col pl-1">
                            <label class="font-medium">{{ data.text.firstName }}</label>
                            <input
                                type="text"
                                v-model="data.formData.firstName"
                                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <div class="flex flex-auto flex-col pr-1">
                            <label class="font-medium">{{ data.text.lastName }}</label>
                            <input
                                type="text"
                                v-model="data.formData.lastName"
                                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label class="font-medium">{{ data.text.email }}</label>
                        <input
                            type="email"
                            v-model="data.formData.email"
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label class="font-medium">{{ data.text.password }}</label>
                        <input
                            type="password"
                            v-model="data.formData.password"
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label class="font-medium">{{ data.text.reEnterPassword }}</label>
                        <input
                            type="password"
                            v-model="data.formData.passwordConfirmation"
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label class="font-medium">{{ data.text.adminKey }}</label>
                        <input
                            type="password"
                            v-model="data.formData.adminKey"
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
                                <span v-if="!data.isLoading">{{ data.text.sendOtp }}</span>
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
                        type="submit"
                        @click.prevent="signupButton"
                        class="w-full px-4 py-2 text-white font-medium bg-primary-600 hover:bg-primary-500 active:bg-primary-600 rounded-lg duration-150"
                    >
                        {{ data.text.createAccountButton }}
                    </button>
                </form>
            </div>
        </div>
    </section>
</template>
