<script setup lang="ts">
const { data } = await useAsyncData("content", () => queryContent("/").findOne());
</script>

<template>
    <section class="relative py-14" id="Pricing">
        <div class="max-w-screen-xl mx-auto text-gray-600 dark:text-gray-300 md:px-8">
            <div class="relative max-w-xl space-y-3 px-4 md:px-0 text-center mx-auto">
                <h3 class="text-primary-600 dark:text-primary-400 font-semibold">
                    {{ data.pricing.title }}
                </h3>
                <p class="text-gray-800 dark:text-white text-3xl font-semibold sm:text-4xl">
                    {{ data.pricing.subtitle }}
                </p>
                <div class="max-w-xl">
                    <p>
                        {{ data.pricing.description }}
                    </p>
                </div>
            </div>
            <div class="mt-16 justify-between gap-8 md:flex">
                <ul class="flex-1 max-w-md space-y-10 px-4 md:px-0">
                    <li
                        v-for="(item, idx) in data.pricing.attribute"
                        :key="idx"
                        class="flex gap-x-3"
                    >
                        <div
                            class="flex-none w-12 h-12 rounded-full bg-primary-50 text-primary-600 dark:text-primary-400 flex items-center justify-center"
                            v-html="item.icon"
                        />
                        <div>
                            <h4 class="text-lg text-gray-800 dark:text-white font-medium">
                                {{ item.name }}
                            </h4>
                            <p class="text-gray-600 dark:text-gray-300 mt-2 md:text-sm">
                                {{ item.desc }}
                            </p>
                        </div>
                    </li>
                </ul>
                <div
                    class="flex-1 flex flex-col border-y mt-6 md:max-w-xl md:rounded-xl md:border md:border-x-none md:shadow-lg"
                >
                    <div class="p-4 py-8 border-b md:p-8">
                        <div class="justify-between flex">
                            <div class="max-w-xs">
                                <span
                                    class="text-2xl text-gray-800 dark:text-white font-semibold sm:text-3xl"
                                >
                                    {{ data.pricing.items.name }}
                                </span>
                                <p class="mt-3 sm:text-sm">
                                    {{ data.pricing.items.desc }}
                                </p>
                            </div>
                            <div
                                class="flex-none text-gray-800 dark:text-white text-2xl font-semibold sm:text-3xl"
                            >
                                ${{ data.pricing.items.price }}
                                <span class="text-xl text-gray-600 dark:text-gray-300 font-normal">
                                    /mo
                                </span>
                            </div>
                        </div>
                        <NuxtLink
                            :to="data.button.getStarted.router"
                            class="mt-4 px-3 py-3 rounded-lg w-full font-semibold text-sm duration-150 text-white bg-primary-500 hover:bg-primary-600 active:bg-primary-700 inline-block text-center"
                        >
                            {{ data.button.getStarted.text }}
                        </NuxtLink>
                    </div>
                    <ul class="p-4 space-y-3 sm:grid sm:grid-cols-2 md:block md:p-8 lg:grid">
                        <div class="pb-2 col-span-2 text-gray-800 dark:text-white font-medium">
                            <p>{{ data.pricing.items.features.title }}</p>
                        </div>
                        <li
                            v-for="(featureItem, idx) in data.pricing.items.features.items"
                            :key="idx"
                            class="flex items-center gap-5"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5 text-primary-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            {{ featureItem }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>
