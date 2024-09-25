<script setup lang="ts">

const externalLinks = ref({
    home: "/",
    dasboard: "#",
    signUp: "/admins/auth/signup",
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
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label class="font-medium">Password</label>
                        <input
                            type="password"
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
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
            <div class="text-center mb-5">
                <NuxtLink :to="externalLinks.resetPassword" class="hover:text-primary-600">
                    Forgot password?
                </NuxtLink>
            </div>
        </div>
    </section>
</template>
