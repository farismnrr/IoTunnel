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
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    phoneNumber: "",
    otp: ""
});
const isLoading = ref(false);

const sendOtp = async () => {
    isLoading.value = true;
    try {
        const otpResponse = await verification.otp.sendOtpUser(formData.value.email);
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

const signup = async () => {
    const signupResponse = await authentication.signup.signupUser({
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        email: formData.value.email,
        password: formData.value.password,
        retypePassword: formData.value.passwordConfirmation,
        phoneNumber: formData.value.phoneNumber,
        otpCode: formData.value.otp
    });
    switch (signupResponse.status) {
        case "fail":
            toast.error(signupResponse.errors ?? "Unexpected error", toastOptions);
            break;
        case "success":
            navigateTo(externalLinks.value.signIn);
            break;
        default:
            toast.info("Unexpected response", toastOptions);
    }
};

const accessTokenUser = computed(() => authStore.accessTokenUser);
onMounted(() => {
    if (accessTokenUser.value) {
        navigateTo(externalLinks.value.dasboard);
    }
});

const externalLinks = ref({
    home: "/",
    signIn: "/users/auth/signin",
    dasboard: "/users/dashboard",
    signWithGoogle: "#"
});
</script>

<template>
    <section
        class="w-full min-h-screen bg-gradient-to-r from-primary-100 to-white sm:px-4 flex justify-center"
    >
        <div class="w-full space-y-6 text-gray-600 sm:max-w-md mb-8">
            <div class="text-center">
                <NuxtLink :to="externalLinks.home">
                    <img src="/icons/logo.svg" width="150" class="mx-auto" />
                </NuxtLink>
                <div class="space-y-2">
                    <h3 class="text-gray-800 text-2xl font-bold sm:text-3xl">Create an account</h3>
                    <p class="">
                        Already have an account?
                        <NuxtLink
                            :to="externalLinks.signIn"
                            class="font-medium text-primary-500 hover:text-primary-400"
                        >
                            Log in
                        </NuxtLink>
                    </p>
                </div>
            </div>
            <div class="bg-white shadow p-4 py-4 sm:p-6 sm:rounded-lg">
                <form class="space-y-5">
                    <div class="flex flex-col sm:flex-row gap-6">
                        <div class="flex flex-auto flex-col pr-1">
                            <label class="font-medium">Last Name</label>
                            <input
                                type="text"
                                v-model="formData.firstName"
                                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <div class="flex flex-auto flex-col pr-1">
                            <label class="font-medium">Last Name</label>
                            <input
                                type="text"
                                v-model="formData.lastName"
                                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                            />
                        </div>
                    </div>

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
                    <div>
                        <label class="font-medium">Re-enter Password</label>
                        <input
                            type="password"
                            v-model="formData.passwordConfirmation"
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label class="font-medium">Phone Number</label>
                        <input
                            type="text"
                            v-model="formData.phoneNumber"
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div class="grid grid-cols-[65%_32%] gap-3 sm:flex-col">
                        <div class="flex flex-auto flex-col">
                            <label class="font-medium">OTP (Email Verification)</label>
                            <input
                                type="text"
                                v-model="formData.otp"
                                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <div class="flex flex-auto flex-col">
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
                        @click.prevent="signup"
                        type="submit"
                        class="w-full px-4 py-2 text-white font-medium bg-primary-600 hover:bg-primary-500 active:bg-primary-600 rounded-lg duration-150"
                    >
                        Create account
                    </button>
                </form>
                <div class="mt-5">
                    <button
                        class="w-full flex items-center justify-center gap-x-3 py-2.5 mt-5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100"
                    >
                        <!-- Comment: Google Icon SVG here -->
                        <img
                            src="https://raw.githubusercontent.com/sidiDev/remote-assets/7cd06bf1d8859c578c2efbfda2c68bd6bedc66d8/google-icon.svg"
                            alt="Google"
                            class="w-5 h-5"
                        />
                        <p>Continue with Google</p>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
