<script setup lang="ts">
const externalLinks = ref({
    home: "/",
    signIn: "/users/auth/signin"
});
</script>

<template>
    <div
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
                    <div class="flex gap-6">
                        <div class="flex flex-col pl-1">
                            <label class="font-medium">First Name</label>
                            <input
                                type="text"
                                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <div class="flex flex-col pr-1">
                            <label class="font-medium">Last Name</label>
                            <input
                                type="text"
                                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                            />
                        </div>
                    </div>

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
                    <div>
                        <label class="font-medium">Re-enter Password</label>
                        <input
                            type="password"
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label class="font-medium">Phone Number</label>
                        <input
                            type="text"
                            class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div class="grid grid-cols-[70%_27%] gap-3">
                        <div class="flex flex-col">
                            <label class="font-medium">OTP (Email Verification)</label>
                            <input
                                type="text"
                                class="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-primary-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <div class="flex flex-col">
                            <button
                                type="submit"
                                class="w-full mt-7 px-3 py-3 text-white font-medium bg-primary-600 hover:bg-primary-500 active:bg-primary-600 rounded-lg duration-150"
                            >
                                Send OTP
                            </button>
                        </div>
                    </div>
                    <button
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
    </div>
</template>
