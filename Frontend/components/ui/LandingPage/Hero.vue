<script setup lang="ts">
const externalLinks = ref({
    getStarted: "#Pricing",
    tryItOut: "/signin"
});
</script>

<template>
    <section class="pt-36 px-4" id="Home">
        <div class="text-center space-y-4">
            <h1 class="text-gray-800 dark:text-white font-bold text-4xl md:text-5xl">
                Optimize your website for
                <span
                    class="text-primary-500 hover:text-primary-600 dark:text-primary-500 dark:hover:text-primary-400"
                >
                    Search engine</span
                >
            </h1>
            <p class="text-gray-500 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
                It is a long established fact that a reader will be distracted by the readable
                content of a page when looking at its layout. The point of using Lorem Ipsum
            </p>
        </div>
        <div class="mt-12 justify-center items-center space-y-3 sm:space-x-6 sm:space-y-0 sm:flex">
            <a
                :href="externalLinks.getStarted"
                class="px-10 py-3.5 w-full bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 text-white text-center rounded-md shadow-md block sm:w-auto"
            >
                Get started
            </a>
            <a
                :href="externalLinks.tryItOut"
                class="px-10 py-3.5 w-full text-gray-500 dark:text-gray-300 text-center border rounded-md duration-300 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow dark:hover:shadow-none block sm:w-auto"
            >
                Try it out
            </a>
        </div>
        <div class="max-w-screen-xl mx-auto gap-12 md:px-8 pb-12">
            <div class="mt-14">
                <img
                    src="https://raw.githubusercontent.com/sidiDev/remote-assets/main/Safari%20(Big%20Sur)%20-%20Light.png"
                    class="w-full shadow-lg rounded-lg border"
                    alt=""
                />
            </div>
        </div>
    </section>
</template>
