<template>
    <section class="py-24" id="Testimonials">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mb-16">
                <h1 class="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl">
                    What our customers are saying
                </h1>

                <p class="max-w-2xl mx-auto mt-4 text-center text-gray-500 xl:mt-6">
                    Don't just take our word for it. Our customers say it best.
                </p>
            </div>
            <!--Slider wrapper-->
            <Swiper
                class="mySwiper"
                :slides-per-view="1"
                :space-between="32"
                :loop="true"
                :centered-slides="true"
                :pagination="{ el: '.swiper-pagination', clickable: true }"
                :autoplay="{ delay: 2500, disableOnInteraction: false }"
                :breakpoints="{
                    640: { slidesPerView: 1, spaceBetween: 32 },
                    768: { slidesPerView: 2, spaceBetween: 32 },
                    1024: { slidesPerView: 3, spaceBetween: 32 }
                }"
            >
                <template v-slot:default>
                    <SwiperSlide v-for="(testimonial, index) in testimonials" :key="index">
                        <div
                            class="group bg-white border border-solid border-gray-300 rounded-xl p-6 transition-all duration-500 w-full mx-auto hover:border-primary hover:shadow-sm slide_active:border-primary"
                        >
                            <div>
                                <div
                                    class="flex items-center mb-7 gap-2 text-amber-500 transition-all duration-500"
                                >
                                    <svg
                                        class="w-5 h-5"
                                        viewBox="0 0 18 17"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span class="text-base font-semibold text-primary">4.9</span>
                                </div>
                                <p
                                    class="text-base text-gray-600 leading-6 transition-all duration-500 pb-8 group-hover:text-gray-800 slide_active:text-gray-800"
                                >
                                    {{ testimonial.text }}
                                </p>
                            </div>
                            <div
                                class="flex items-center gap-5 border-t border-solid border-gray-200 pt-5"
                            >
                                <img
                                    class="rounded-full h-10 w-10 object-cover"
                                    :src="testimonial.avatar"
                                    alt="avatar"
                                />
                                <div class="block">
                                    <h5
                                        class="text-gray-900 font-medium transition-all duration-500 mb-1"
                                    >
                                        {{ testimonial.name }}
                                    </h5>
                                    <span class="text-sm leading-4 text-gray-500">{{
                                        testimonial.position
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </template>
            </Swiper>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";

interface Testimonial {
    text: string;
    avatar: string;
    name: string;
    position: string;
}

const testimonials = ref<Testimonial[]>([
    {
        text: "IoTunnel has revolutionized our IoT operations. We can now monitor and manage our devices in real-time, reducing downtime and increasing efficiency.",
        avatar: "https://pagedone.io/asset/uploads/1696229969.png",
        name: "Jane D",
        position: "IoT Engineer"
    },
    {
        text: "With IoTunnel, we've been able to unlock new insights from our IoT devices and make data-driven decisions. It's been a game-changer for our business.",
        avatar: "https://pagedone.io/asset/uploads/1696229994.png",
        name: "Harsh P.",
        position: "IoT Engineer"
    },
    {
        text: "IoTunnel's customer support is top-notch. They're always available to help us troubleshoot issues and optimize our IoT setup.",
        avatar: "https://pagedone.io/asset/uploads/1696230027.png",
        name: "Alex K.",
        position: "Operations Manager"
    },
    {
        text: "IoTunnel has revolutionized our IoT operations. We can now monitor and manage our devices in real-time, reducing downtime and increasing efficiency.",
        avatar: "https://pagedone.io/asset/uploads/1696229969.png",
        name: "Jane D",
        position: "IoT Engineer"
    },
    {
        text: "With IoTunnel, we've been able to unlock new insights from our IoT devices and make data-driven decisions. It's been a game-changer for our business.",
        avatar: "https://pagedone.io/asset/uploads/1696229994.png",
        name: "Harsh P.",
        position: "IoT Engineer"
    }
]);
</script>

<style scoped>
.swiper-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet,
.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet {
    @apply w-4 h-1 rounded-md mx-1.5 !important;
}

.swiper-pagination {
    @apply bottom-0.5 !important;
}

.swiper-wrapper {
    @apply h-max w-max pb-16 !important;
}

.swiper-pagination-bullet-active {
    @apply bg-primary-300 !important;
}

.swiper-slide.swiper-slide-active > .slide_active\:border-primary {
    --tw-border-opacity: 1;
    border-color: theme("colors.primary.500");
}

.swiper-slide.swiper-slide-active > .group .slide_active\:text-gray-800 {
    --tw-text-opacity: 1;
    color: theme("colors.gray.800");
}
</style>
