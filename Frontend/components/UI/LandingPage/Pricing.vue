<script setup lang="ts">
import { CheckIcon } from "@heroicons/vue/20/solid";

const includedFeatures = [
    "Priority Support",
    "Advanced Analytics",
    "Custom Integrations",
    "Exclusive Updates"
];

const data = ref({
    feature: includedFeatures,
    text: {
        title: "IoTunnel pricing plan",
        subtitle:
            "IoTunnel is designed to be simple and flexible. Choose the plan that fits your IoT needs.",
        membershipTitle: "Lifetime membership",
        membershipDescription:
            "Unlock unlimited devices, data points, and premium features, including advanced analytics, custom integrations, and priority support.",
        whatsIncluded: "What's included",
        paymentInfo: "Pay once, own it forever",
        price: "$349",
        currency: "USD",
        getAccess: "Get access",
        invoiceInfo: "Invoices and receipts available for easy company reimbursement"
    },
    internalLink: {
        getAccess: "#"
    }
});
</script>

<template>
    <section id="Pricing">
        <div class="py-24 sm:py-32">
            <div class="mx-auto max-w-7xl px-6 lg:px-8">
                <div class="mx-auto max-w-2xl sm:text-center">
                    <h1
                        class="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl"
                    >
                        {{ data.text.title }}
                    </h1>

                    <p class="max-w-2xl mx-auto mt-4 text-center text-gray-500 xl:mt-6">
                        {{ data.text.subtitle }}
                    </p>
                </div>
                <div
                    class="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none"
                >
                    <div class="p-8 sm:p-10 lg:flex-auto">
                        <h3 class="text-2xl font-bold tracking-tight text-gray-900">
                            {{ data.text.membershipTitle }}
                        </h3>
                        <p class="mt-6 text-base leading-7 text-gray-600">
                            {{ data.text.membershipDescription }}
                        </p>
                        <div class="mt-10 flex items-center gap-x-4">
                            <h4 class="flex-none text-sm font-semibold leading-6 text-primary-600">
                                {{ data.text.whatsIncluded }}
                            </h4>
                            <div class="h-px flex-auto bg-gray-100" />
                        </div>
                        <ul
                            role="list"
                            class="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
                        >
                            <li
                                v-for="feature in includedFeatures"
                                :key="feature"
                                class="flex gap-x-3"
                            >
                                <CheckIcon
                                    class="h-6 w-5 flex-none text-primary-600"
                                    aria-hidden="true"
                                />
                                {{ feature }}
                            </li>
                        </ul>
                    </div>
                    <div class="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                        <div
                            class="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16"
                        >
                            <div class="mx-auto max-w-xs px-8">
                                <p class="text-base font-semibold text-gray-600">
                                    {{ data.text.paymentInfo }}
                                </p>
                                <p class="mt-6 flex items-baseline justify-center gap-x-2">
                                    <span class="text-5xl font-bold tracking-tight text-gray-900">{{
                                        data.text.price
                                    }}</span>
                                    <span
                                        class="text-sm font-semibold leading-6 tracking-wide text-gray-600"
                                        >{{ data.text.currency }}</span
                                    >
                                </p>
                                <NuxtLink
                                    :to="data.internalLink.getAccess"
                                    class="mt-10 block w-full rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                                    >{{ data.text.getAccess }}</NuxtLink
                                >
                                <p class="mt-6 text-xs leading-5 text-gray-600">
                                    {{ data.text.invoiceInfo }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
