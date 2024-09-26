<script setup lang="ts">
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import createAuthentication from "~/composables/Authentication";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const authentication = createAuthentication(config);

const toastOptions = {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 1000
};

const formData = ref({
    email: "",
    password: ""
});

const signin = async () => {
    const signinResponse = await authentication.signin.signinUser({
        email: formData.value.email,
        password: formData.value.password
    });
    switch (signinResponse.status) {
        case "fail":
            toast.error(signinResponse.errors ?? "Unexpected error", toastOptions);
            break;
        case "success":
            authStore.setAccessTokenUser(signinResponse.data?.access_token ?? "");
            navigateTo(externalLinks.value.dasboard);
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
    signUp: "/users/auth/signup",
    dasboard: "/test",
    resetPassword: "#",
    signWithGoogle: "#"
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
                <div class="grid grid-cols-1 gap-x-3">
                    <NuxtLink
                        :to="externalLinks.signWithGoogle"
                        class="flex items-center justify-center py-2.5 border rounded-lg hover:bg-gray-50 duration-150 active:bg-gray-100"
                    >
                        <!-- Comment: Google Icon SVG here -->
                        <img
                            src="https://raw.githubusercontent.com/sidiDev/remote-assets/7cd06bf1d8859c578c2efbfda2c68bd6bedc66d8/google-icon.svg"
                            alt="Google"
                            class="w-5 h-5"
                        />
                    </NuxtLink>
                </div>
                <div class="relative">
                    <span class="block w-full h-px bg-gray-300"></span>
                    <p
                        class="inline-block w-fit text-sm bg-white px-2 absolute -top-2 inset-x-0 mx-auto"
                    >
                        Or continue with
                    </p>
                </div>
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
                    <button
                        @click.prevent="signin"
                        type="submit"
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
