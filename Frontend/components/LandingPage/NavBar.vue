<script setup lang="ts">
import { ref } from "vue";

const { data } = await useAsyncData("content", () => queryContent("/").findOne());
const isOpen = ref(false);
function toggleMenuOpen() {
    isOpen.value = !isOpen.value;
}

const isSticky = ref(true);
</script>

<template>
    <nav
        :class="{ sticky: isSticky }"
        class="bg-white dark:bg-gray-800 w-full border-b md:border-0 md:static"
    >
        <div class="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
            <div class="flex items-center justify-between py-3 md:py-5 md:block">
                <a :href="data.button.home.router" class="flex mr-4">
                    <img src="@/assets/logo.svg" class="mr-1 h-10" alt="IoTunnel Logo" />
                    <span
                        class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
                    >
                        {{ data.title }}
                    </span>
                </a>
                <div class="md:hidden">
                    <button
                        class="text-gray-700 dark:text-gray-200 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
                        @click="toggleMenuOpen()"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            :class="[isOpen ? 'block' : 'hidden']"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            :class="[isOpen ? 'hidden' : 'block']"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 8h16M4 16h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div
                class="flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0"
                :class="[isOpen ? 'block' : 'hidden']"
            >
                <ul class="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                    <li
                        v-for="link in data.navigation"
                        :key="link.title"
                        class="text-gray-600 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-200"
                    >
                        <a :href="link.router">
                            {{ link.title }}
                        </a>
                    </li>
                </ul>
            </div>
            <div class="hidden md:inline-block">
                <a
                    :href="data.button.signIn.router"
                    class="py-3 px-4 text-gray-600 dark:text-white hover:text-primary-600 dark:hover:text-primary-200"
                >
                    {{ data.button.signIn.text }}
                </a>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.sticky {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
}
</style>
