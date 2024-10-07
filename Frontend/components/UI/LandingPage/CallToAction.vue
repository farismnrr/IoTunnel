<script setup lang="ts">
import { ref } from "vue";

const data = ref({
    text: {
        title: 'Bring your Business to the <span class="text-primary-500">next level.</span>',
        description:
            "Take your business to new heights with IoTunnel powerful IoT management platform. Simplify your IoT operations, reduce costs, and increase efficiency.",
        buttonText: "Start 14-Day free trial",
        disclaimer: "No credit card required"
    },
    internalLink: {
        signup: "#"
    }
});
</script>

<template>
    <section>
        <div class="container flex flex-col items-center px-4 py-12 mx-auto text-center">
            <h2
                class="max-w-2xl mx-auto text-2xl font-semibold tracking-tight text-gray-800 xl:text-3xl"
                v-html="data.text.title"
            ></h2>

            <p class="max-w-4xl mt-6 text-center text-gray-500">
                {{ data.text.description }}
            </p>

            <NuxtLink
                :to="data.internalLink.signup"
                class="inline-block px-5 py-2 mt-6 text-sm font-medium leading-5 text-center text-white capitalize bg-primary-600 rounded-lg hover:bg-primary-500 lg:mx-0 lg:w-auto focus:outline-none"
            >
                {{ data.text.buttonText }}
            </NuxtLink>
            <p class="mt-3 text-sm text-gray-400">{{ data.text.disclaimer }}</p>
        </div>
    </section>
</template>
