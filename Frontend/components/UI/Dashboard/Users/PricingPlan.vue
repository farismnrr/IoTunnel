<script setup lang="ts">
interface Window {
    snap?: {
        pay: (
            token: string,
            options: {
                onSuccess?: () => void;
                onPending?: () => void;
                onClose?: () => void;
            }
        ) => void;
    };
}

const data = ref({
    activePlan: "",
    isOpen: false,
    snapToken: "",
    productsData: null as ProductData | null,
    loading: true,
    orderId: "",
    internalLink: {
        signin: "/users/signin",
        dashboard: "/users/dashboard"
    },
    text: {
        choosePlan: "Choose your plan",
        pricingPlan: "Pricing Plan",
        choosePlanButton: "Choose Plan",
        startTrialButton: "Start Free Trial"
    }
});

import ProductService from "@/composables/service/productService";
import TrialService from "@/composables/service/trialService";
import OrderService from "@/composables/service/orderService";
import mapUtils from "@/composables/utils/mapping";
import { useRuntimeConfig } from "#app";
import type { ProductData, Product } from "@/composables/model";

const config = useRuntimeConfig();
const setActivePlan = (planId: string) => {
    data.value.activePlan = planId;
};

const closeModal = () => {
    data.value.isOpen = false;
};

const handlePayment = async () => {
    const orderService = OrderService(data.value.internalLink.dashboard, config);
    const order = await orderService.createOrder(data.value.activePlan);
    if (!order) return;
    data.value.orderId = order.id;
    const snap = (window as Window).snap;
    if (snap && typeof snap.pay === "function") {
        snap.pay(order.token, {
            onSuccess: async () => {
                console.log("Payment successful");
                data.value.isOpen = false;
                await orderService.getOrder(data.value.orderId);
            },
            onPending: () => {
                console.log("Payment pending");
                data.value.isOpen = false;
            },
            onClose: () => {
                console.log("Snap payment closed");
                data.value.isOpen = true;
            }
        });
    } else {
        console.error("Snap.js is not loaded or snap.pay is not a function");
    }
};

const handleFreeTrial = async () => {
    const trialService = TrialService(data.value.internalLink.signin, config);
    const isOpen = await trialService.updateTrial();
    data.value.isOpen = isOpen;
};

const getPlans = computed(() => {
    if (!data.value.productsData) return [];
    return mapUtils.mapData(data.value.productsData.products, (product: Product) => ({
        id: product.id,
        name: product.product_name,
        duration: product.duration,
        price: product.price === "FREE" ? "FREE" : `$${product.price}`,
        tag: product.tags
    }));
});

onMounted(async () => {
    const productService = ProductService(config);
    const products = await productService.getProducts();
    data.value.productsData = products;
    data.value.loading = false;

    data.value.isOpen = true;
    const script = document.createElement("script");
    script.src = config.public.midtrans.snapUrl;
    script.setAttribute("data-client-key", config.public.midtrans.clientKey);
    document.head.appendChild(script);
});

watch(
    () => data.value.isOpen,
    newValue => {
        if (newValue) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
    }
);
</script>

<template>
    <section v-if="data.isOpen">
        <div class="fixed inset-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div
                class="bg-white rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                <div class="p-4 sm:p-6 flex-grow overflow-y-auto">
                    <header class="flex items-center justify-between mb-4">
                        <h2 class="text-base md:text-lg font-medium text-gray-800"></h2>
                        <button @click.prevent="closeModal" class="p-2 text-gray-400 rounded-md hover:bg-gray-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4 md:w-5 md:h-5 mx-auto"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </button>
                    </header>
                    <main>
                        <div class="container mx-auto">
                            <p class="text-base md:text-lg text-center text-gray-500">{{ data.text.choosePlan }}</p>

                            <h1 class="mt-4 text-xl md:text-2xl font-semibold text-center text-gray-800 capitalize">
                                {{ data.text.pricingPlan }}
                            </h1>

                            <div v-if="data.loading" class="mt-6 space-y-4 xl:mt-12">
                                <div
                                    v-for="i in 3"
                                    :key="i"
                                    class="animate-pulse flex items-center justify-between px-4 py-3 mx-auto border rounded-xl"
                                >
                                    <div class="flex items-center">
                                        <div class="w-4 h-4 md:h-6 md:w-6 bg-gray-200 rounded-full"></div>
                                        <div class="flex flex-col mx-3 space-y-1">
                                            <div class="h-2 bg-gray-200 rounded w-20"></div>
                                            <div class="h-4 bg-gray-200 rounded w-24"></div>
                                            <div class="h-2 bg-gray-200 rounded w-16"></div>
                                        </div>
                                    </div>
                                    <div class="h-4 bg-gray-200 rounded w-12"></div>
                                </div>
                            </div>

                            <div v-else class="mt-6 space-y-4 xl:mt-12">
                                <div
                                    v-for="plan in getPlans"
                                    :key="plan.id"
                                    @click.prevent="setActivePlan(plan.id)"
                                    class="flex items-center justify-between px-4 py-3 mx-auto border cursor-pointer rounded-xl transition-all duration-300 ease-in-out hover:shadow-md"
                                    :class="{ 'border-primary-500 shadow-md': data.activePlan === plan.id }"
                                >
                                    <div class="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="w-4 h-4 md:h-6 md:w-6 text-gray-400 transition-colors duration-300"
                                            :class="{ 'text-primary-500': data.activePlan === plan.id }"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>

                                        <div class="flex flex-col mx-3 space-y-1">
                                            <p class="text-xs md:text-sm text-primary-500">
                                                {{ plan.duration }}
                                            </p>
                                            <h2
                                                class="text-sm md:text-base font-medium text-gray-700 transition-colors duration-300"
                                                :class="{ 'text-primary-700': data.activePlan === plan.id }"
                                            >
                                                {{ plan.name }}
                                            </h2>
                                            <div
                                                v-if="plan.tag"
                                                class="px-2 text-xs md:text-sm text-primary-500 bg-gray-100 rounded-full md:px-3 md:py-1 flex items-center justify-center transition-colors duration-300"
                                                :class="{ 'bg-primary-100': data.activePlan === plan.id }"
                                            >
                                                {{ plan.tag }}
                                            </div>
                                        </div>
                                    </div>

                                    <h2
                                        class="text-base md:text-lg font-semibold text-gray-500 transition-colors duration-300"
                                        :class="{ 'text-primary-600': data.activePlan === plan.id }"
                                    >
                                        {{ plan.price }}
                                    </h2>
                                </div>
                            </div>

                            <div class="flex justify-center mt-6">
                                <button
                                    v-if="data.activePlan === 'PROD001'"
                                    @click.prevent="handleFreeTrial"
                                    class="w-full px-4 py-2 text-sm md:text-base tracking-wide text-white capitalize transition-all duration-300 transform bg-primary-600 rounded-md hover:bg-primary-500 focus:outline-none focus:bg-primary-500 focus:ring focus:ring-primary-300 focus:ring-opacity-80"
                                >
                                    {{ data.text.startTrialButton }}
                                </button>
                                <button
                                    v-else
                                    @click.prevent="handlePayment"
                                    class="w-full px-4 py-2 text-sm md:text-base tracking-wide text-white capitalize transition-all duration-300 transform bg-primary-600 rounded-md hover:bg-primary-500 focus:outline-none focus:bg-primary-500 focus:ring focus:ring-primary-300 focus:ring-opacity-80"
                                >
                                    {{ data.text.choosePlanButton }}
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.overflow-y-auto {
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.overflow-y-auto::-webkit-scrollbar {
    display: none;
}
</style>
