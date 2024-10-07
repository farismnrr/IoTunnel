<script setup lang="ts">
import { ref } from "vue";

const data = ref({
    text: {
        title: "IoTunnel",
        copyright: "© 2024 IoTunnel. All Rights Reserved.",
        about: "About",
        privacyPolicy: "Privacy Policy",
        licensing: "Licensing",
        contact: "Contact"
    },
    internalLink: {
        home: "/",
        about: "#",
        privacyPolicy: "#",
        licensing: "#",
        contact: "#"
    }
});
</script>
<template>
    <div class="bg-white rounded-lg shadow m-4">
        <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span class="text-sm text-gray-500 sm:text-center">
                {{ data.text.copyright }}
                <NuxtLink :to="data.internalLink.home" class="hover:underline">
                    {{ data.text.title }}
                </NuxtLink>
            </span>
            <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
                <li>
                    <NuxtLink :to="data.internalLink.about" class="hover:underline me-4 md:me-6">
                        {{ data.text.about }}
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink
                        :to="data.internalLink.privacyPolicy"
                        class="hover:underline me-4 md:me-6"
                    >
                        {{ data.text.privacyPolicy }}
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink
                        :to="data.internalLink.licensing"
                        class="hover:underline me-4 md:me-6"
                    >
                        {{ data.text.licensing }}
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink :to="data.internalLink.contact" class="hover:underline">
                        {{ data.text.contact }}
                    </NuxtLink>
                </li>
            </ul>
        </div>
    </div>
</template>
