<script setup lang="ts">
const data = ref({
    text: {
        documentationLink: "IoTunnel Documentation.",
        readMore: "Read more",
        title: "Unlock the Power of IoT with IoTunnel",
        description:
            "IoTunnel is a revolutionary SaaS platform that helps you simplify IoT device management, reduce costs, and increase efficiency.",
        getStarted: "Get started",
        learnMore: "Learn more",
        learnMoreArrow: "→"
    },
    internalLink: {
        documentation: "#",
        getStarted: "#",
        learnMore: "#"
    }
});
</script>

<template>
    <section class="relative isolate px-6 pt-14 lg:px-8">
        <div
            class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
        >
            <div
                class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-400 to-primary-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style="
                    clip-path: polygon(
                        74.1% 44.1%,
                        100% 61.6%,
                        97.5% 26.9%,
                        85.5% 0.1%,
                        80.7% 2%,
                        72.5% 32.5%,
                        60.2% 62.4%,
                        52.4% 68.1%,
                        47.5% 58.3%,
                        45.2% 34.5%,
                        27.5% 76.7%,
                        0.1% 64.9%,
                        17.9% 100%,
                        27.6% 76.8%,
                        76.1% 97.7%,
                        74.1% 44.1%
                    );
                "
            />
        </div>
        <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div class="hidden sm:mb-8 sm:flex sm:justify-center">
                <div
                    class="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                >
                    {{ data.text.documentationLink }}
                    <NuxtLink
                        :to="data.internalLink.documentation"
                        class="font-semibold text-primary-600"
                    >
                        <span class="absolute inset-0" aria-hidden="true" />{{ data.text.readMore }}
                        <span aria-hidden="true">&rarr;</span>
                    </NuxtLink>
                </div>
            </div>
            <div class="text-center">
                <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    {{ data.text.title }}
                </h1>
                <p class="mt-6 text-lg leading-8 text-gray-600">
                    {{ data.text.description }}
                </p>
                <div class="mt-10 flex items-center justify-center gap-x-6">
                    <NuxtLink
                        :to="data.internalLink.getStarted"
                        class="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                        {{ data.text.getStarted }}
                    </NuxtLink>
                    <NuxtLink
                        :to="data.internalLink.learnMore"
                        class="text-sm font-semibold leading-6 text-gray-900"
                    >
                        {{ data.text.learnMore }}
                        <span aria-hidden="true">{{ data.text.learnMoreArrow }}</span>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div
            class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
        >
            <div
                class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-400 to-primary-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style="
                    clip-path: polygon(
                        74.1% 44.1%,
                        100% 61.6%,
                        97.5% 26.9%,
                        85.5% 0.1%,
                        80.7% 2%,
                        72.5% 32.5%,
                        60.2% 62.4%,
                        52.4% 68.1%,
                        47.5% 58.3%,
                        45.2% 34.5%,
                        27.5% 76.7%,
                        0.1% 64.9%,
                        17.9% 100%,
                        27.6% 76.8%,
                        76.1% 97.7%,
                        74.1% 44.1%
                    );
                "
            />
        </div>
    </section>
</template>
