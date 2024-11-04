<script setup lang="ts">
import { Dialog, DialogPanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";

const navigation = [
    { name: "Features", to: "#Features" },
    { name: "Pricing", to: "#Pricing" },
    { name: "Testimonials", to: "#Testimonials" },
    { name: "Contact", to: "#Contact" }
];

const data = ref({
    navigation: navigation,
    mobileMenuOpen: false,
    text: {
        title: "IoTunnel",
        login: "Log in",
        loginArrow: "→"
    },
    internalLink: {
        home: "/",
        signin: "/users/signin"
    }
});
</script>
<template>
    <div class="absolute inset-x-0 top-0 z-50">
        <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div class="flex lg:flex-1">
                <NuxtLink :to="data.internalLink.home" class="-m-1.5 p-1.5">
                    <span class="sr-only">{{ data.text.title }}</span>
                    <img class="h-10 w-auto" src="/icons/logo.svg" :alt="data.text.title" />
                </NuxtLink>
            </div>
            <div class="flex lg:hidden">
                <button
                    type="button"
                    class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    @click="data.mobileMenuOpen = true"
                >
                    <span class="sr-only">Open main menu</span>
                    <Bars3Icon class="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            <div class="hidden lg:flex lg:gap-x-12">
                <NuxtLink
                    v-for="item in data.navigation"
                    :key="item.name"
                    :to="item.to"
                    class="text-sm font-semibold leading-6 text-gray-900"
                >
                    {{ item.name }}
                </NuxtLink>
            </div>
            <div class="hidden lg:flex lg:flex-1 lg:justify-end">
                <NuxtLink
                    :to="data.internalLink.signin"
                    class="text-sm font-semibold leading-6 text-gray-900"
                >
                    {{ data.text.login }} <span aria-hidden="true">{{ data.text.loginArrow }}</span>
                </NuxtLink>
            </div>
        </nav>
        <Dialog class="lg:hidden" @close="data.mobileMenuOpen = false" :open="data.mobileMenuOpen">
            <div class="fixed inset-0 z-50" />
            <DialogPanel
                class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
            >
                <div class="flex items-center justify-between">
                    <NuxtLink :to="data.internalLink.home" class="-m-1.5 p-1.5">
                        <span class="sr-only">{{ data.text.title }}</span>
                        <img class="h-10 w-auto" src="/icons/logo.svg" :alt="data.text.title" />
                    </NuxtLink>
                    <button
                        type="button"
                        class="-m-2.5 rounded-md p-2.5 text-gray-700"
                        @click="data.mobileMenuOpen = false"
                    >
                        <span class="sr-only">Close menu</span>
                        <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div class="mt-6 flow-root">
                    <div class="-my-6 divide-y divide-gray-500/10">
                        <div class="space-y-2 py-6">
                            <NuxtLink
                                v-for="item in data.navigation"
                                :key="item.name"
                                :to="item.to"
                                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >
                                {{ item.name }}
                            </NuxtLink>
                        </div>
                        <div class="py-6">
                            <NuxtLink
                                :to="data.internalLink.signin"
                                class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >
                                {{ data.text.login }}
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </DialogPanel>
        </Dialog>
    </div>
</template>
