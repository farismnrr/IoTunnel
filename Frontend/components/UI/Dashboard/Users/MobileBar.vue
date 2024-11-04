<script setup lang="ts">
const data = ref({
    links: {
        dashboard: "/users/dashboard",
        projects: "#",
        newItem: "#",
        machineLearning: "#",
        profile: "#"
    }
});
</script>

<template>
    <section
        class="fixed w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2"
    >
        <div class="grid h-full max-w-lg grid-cols-5 mx-auto">
            <NuxtLink
                :to="data.links.dashboard"
                data-tooltip-target="tooltip-dashboard"
                class="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-gray-50 group"
            >
                <svg
                    class="w-6 h-6 mb-1 text-gray-500 group-hover:text-primary-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                    />
                </svg>
                <span class="sr-only">Dashboard</span>
            </NuxtLink>
            <div
                id="tooltip-dashboard"
                role="tooltip"
                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
            >
                Dashboard
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
            <NuxtLink
                :to="data.links.projects"
                data-tooltip-target="tooltip-projects"
                class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
            >
                <svg
                    class="w-5 h-5 mb-1 text-gray-500 group-hover:text-primary-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                    />
                </svg>
                <span class="sr-only">Projects</span>
            </NuxtLink>
            <div
                id="tooltip-projects"
                role="tooltip"
                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
            >
                Projects
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
            <div class="flex items-center justify-center">
                <NuxtLink
                    :to="data.links.newItem"
                    data-tooltip-target="tooltip-new"
                    class="inline-flex items-center justify-center w-10 h-10 font-medium bg-primary-600 rounded-full hover:bg-primary-700 group focus:ring-4 focus:ring-primary-300 focus:outline-none"
                >
                    <svg
                        class="w-4 h-4 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 18"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 1v16M1 9h16"
                        />
                    </svg>
                    <span class="sr-only">New item</span>
                </NuxtLink>
            </div>
            <div
                id="tooltip-new"
                role="tooltip"
                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
            >
                Create new item
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
            <NuxtLink
                :to="data.links.machineLearning"
                data-tooltip-target="tooltip-machine-learning"
                class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
            >
                <svg
                    class="w-5 h-5 mb-1 text-gray-500 group-hover:text-primary-600"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                >
                    <path fill="currentColor" d="M11 8h2v1h-2zm0-4h2v1h-2zm0 6h2v1h-2z"></path>
                    <path
                        fill="currentColor"
                        d="M21 12V9a13.12 13.12 0 0 0-8.354 3h-1.292A13.12 13.12 0 0 0 3 9v3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v4a13.15 13.15 0 0 1 9 3.55A13.2 13.2 0 0 1 21 20v-4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
                    ></path>
                    <circle cx="9" cy="4" r="1" fill="currentColor"></circle>
                    <circle cx="15" cy="4" r="1" fill="currentColor"></circle>
                    <path
                        fill="currentColor"
                        d="M16 8H8a3.003 3.003 0 0 1-3-3V3a3.003 3.003 0 0 1 3-3h8a3.003 3.003 0 0 1 3 3v2a3.003 3.003 0 0 1-3 3M8 2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"
                    ></path>
                </svg>
                <span class="sr-only">Machine Learning</span>
            </NuxtLink>
            <div
                id="tooltip-machine-learning"
                role="tooltip"
                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
            >
                Machine Learning
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
            <NuxtLink
                :to="data.links.profile"
                data-tooltip-target="tooltip-profile"
                class="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 group"
            >
                <svg
                    class="w-5 h-5 mb-1 text-gray-500 group-hover:text-primary-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"
                    />
                </svg>
                <span class="sr-only">Profile</span>
            </NuxtLink>
            <div
                id="tooltip-profile"
                role="tooltip"
                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
            >
                Profile
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
        </div>
    </section>
</template>
