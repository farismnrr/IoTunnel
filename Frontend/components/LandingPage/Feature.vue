<script setup lang="ts">
const { data } = await useAsyncData("content", () => queryContent("/").findOne());
</script>

<template>
    <section class="py-14" id="Features">
        <div class="max-w-screen-xl mx-auto px-4 text-gray-600 dark:text-gray-300 md:px-8">
            <div class="max-w-xl mx-auto space-y-3 text-center">
                <h3 class="text-primary-600 dark:text-primary-400 font-semibold">
                    {{ data.feature.title }}
                </h3>
                <p class="text-gray-800 dark:text-white text-3xl font-semibold sm:text-4xl">
                    {{ data.feature.subtitle }}
                </p>
                <p>
                    {{ data.feature.description }}
                </p>
            </div>
            <div class="mt-12">
                <ul class="grid gap-y-8 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
                    <li v-for="(item, idx) in data.feature.items" :key="idx" class="flex gap-x-4">
                        <div
                            class="flex-none w-12 h-12 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                                v-html="item.icon"
                            />
                        </div>
                        <div>
                            <h4 class="text-lg text-gray-800 dark:text-white font-semibold">
                                {{ item.name }}
                            </h4>
                            <p class="mt-3">
                                {{ item.desc }}
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>
