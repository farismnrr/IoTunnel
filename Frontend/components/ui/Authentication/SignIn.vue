<script setup lang="ts">
const config = useRuntimeConfig();
const data = ref(null);
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleSubmit = async () => {
    try {
        const response = await $fetch(
            `${config.public.apiUrl}/${config.public.apiVersion}/users/login`,
            {
                method: "POST",
                body: JSON.stringify({
                    email: email.value,
                    password: password.value
                })
            }
        );

        data.value = response;
        navigateTo(externalLinks.value.dasboard);
    } catch (err: any) {
        const responseMessage = err.response;
        errorMessage.value = JSON.stringify(responseMessage._data.errors, null, 2);
    }
};

const externalLinks = ref({
    home: "/",
    dasboard: "/dashboard",
    signUp: "/signup",
    signWithGoogle: "/signin/google",
    resetPassword: "/users/reset"
});
</script>
<template>
    <main
        class="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white to-primary-200 dark:from-gray-800 dark:to-gray-900 sm:px-4"
    >
        <div class="w-full space-y-6 text-gray-600 dark:text-gray-300 sm:max-w-md">
            <div class="text-center">
                <a :href="externalLinks.home">
                    <img src="@/assets/logo.svg" width="150" class="mx-auto" />
                </a>
                <div class="mt-5 space-y-2">
                    <h3 class="text-gray-800 dark:text-white text-2xl font-bold sm:text-3xl">
                        Log in to your account
                    </h3>
                    <p class="">
                        Don't have an account?
                        <a
                            :href="externalLinks.signUp"
                            class="font-medium text-primary-500 hover:text-primary-400"
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
            <div class="bg-white shadow p-4 py-6 space-y-8 sm:p-6 sm:rounded-lg">
                <div class="grid grid-cols-1 gap-x-3">
                    <a
                        :href="externalLinks.signWithGoogle"
                        class="flex items-center justify-center py-2.5 border rounded-lg hover:bg-gray-50 duration-150 active:bg-gray-100"
                    >
                        <!-- Comment: Google Icon SVG here -->
                        <img
                            src="https://raw.githubusercontent.com/sidiDev/remote-assets/7cd06bf1d8859c578c2efbfda2c68bd6bedc66d8/google-icon.svg"
                            alt="Google"
                            class="w-5 h-5"
                        />
                    </a>
                </div>
                <div class="relative">
                    <span class="block w-full h-px bg-gray-300"></span>
                    <p
                        class="inline-block w-fit text-sm dark:text-black bg-white px-2 absolute -top-2 inset-x-0 mx-auto"
                    >
                        Or continue with
                    </p>
                </div>
                <form @submit.prevent="handleSubmit" class="space-y-5">
                    <div>
                        <label class="font-medium dark:text-gray-600">Email</label>
                        <input
                            type="email"
                            required
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                            v-model="email"
                        />
                    </div>
                    <div>
                        <label class="font-medium dark:text-gray-600">Password</label>
                        <input
                            type="password"
                            required
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                            v-model="password"
                        />
                    </div>
                    <button
                        class="w-full px-4 py-2 text-white font-medium bg-primary-600 hover:bg-primary-500 active:bg-primary-600 rounded-lg duration-150"
                        type="submit"
                    >
                        Sign in
                    </button>
                </form>
            </div>
            <div class="text-center">
                <a :href="externalLinks.resetPassword" class="hover:text-primary-600">
                    Forgot password?
                </a>
            </div>
        </div>
    </main>
</template>
