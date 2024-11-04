<script setup lang="ts">
const data = ref({
    internalLinks: {
        homeUrl: "/",
        dashboardUrl: "/users/dashboard",
        projectsUrl: "#",
        tasksUrl: "#",
        reportingUrl: "#",
        usersUrl: "#",
        settingsUrl: "/users/settings",
        userAvatarLink: "#",
        logoutUrl: "/",
        signin: "/users/signin"
    },
    externalLinks: {
        featureImageUrl:
            "https://images.unsplash.com/photo-1658953229664-e8d5ebd039ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90oy1wYWgefHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&h=1374&q=80",
        userAvatarUrl:
            "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90oy1wYWgefHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&h=634&q=80"
    },
    logo: {
        iconLogo: "/icons/logo.svg"
    },
    text: {
        userName: "John Doe",
        featureTitle: "New feature available!",
        featureText: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus harum officia eligendi velit.",
        appName: "IoTunnel",
        home: "Home",
        dashboard: "Dashboard",
        projects: "Projects",
        machineLearning: "Machine Learning",
        settings: "Settings"
    },
    dropDownItems: [
        {
            name: "Products",
            url: "#"
        },
        {
            name: "Billing",
            url: "#"
        },
        {
            name: "Invoice",
            url: "#"
        }
    ]
});
import TokenService from "@/composables/service/tokenService";

const config = useRuntimeConfig();
const tokenService = TokenService(data.value.internalLinks.signin, config);
const logout = async () => {
    await tokenService.deleteUserToken();
};

const toggleProjectsDropdown = () => {
    const dropdown = document.getElementById("dropdown-projects");
    if (dropdown) {
        dropdown.classList.toggle("hidden");
    } else {
        console.error("Dropdown element not found!");
    }
};
</script>

<template>
    <aside
        class="fixed w-64 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l flex flex-col"
    >
        <NuxtLink :to="data.internalLinks.homeUrl">
            <div class="flex items-center space-x-2">
                <img class="w-auto h-10" :src="data.logo.iconLogo" alt="" />
                <h1 class="text-md font-bold">{{ data.text.appName }}</h1>
            </div>
        </NuxtLink>

        <div class="flex flex-col justify-between flex-1 mt-6">
            <nav class="flex-1 -mx-3 space-y-3">
                <NuxtLink
                    class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
                    :to="data.internalLinks.homeUrl"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                    >
                        <path
                            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>

                    <span class="mx-2 text-sm font-medium">{{ data.text.home }}</span>
                </NuxtLink>

                <NuxtLink
                    class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
                    :to="data.internalLinks.dashboardUrl"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                    >
                        <path
                            d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>

                    <span class="mx-2 text-sm font-medium">{{ data.text.dashboard }}</span>
                </NuxtLink>
                <NuxtLink
                    class="flex items-center justify-between px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
                    :to="data.internalLinks.projectsUrl"
                    @click="toggleProjectsDropdown"
                >
                    <div class="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-5 h-5"
                        >
                            <path
                                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        <span class="mx-2 text-sm font-medium">{{ data.text.projects }}</span>
                    </div>
                    <svg
                        class="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m1 1 4 4 4-4"
                        />
                    </svg>
                </NuxtLink>
                <ul id="dropdown-projects" class="hidden">
                    <li v-for="item in data.dropDownItems" :key="item.name">
                        <a
                            :href="item.url"
                            class="flex items-center w-full p-2 text-gray-600 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 text-sm font-medium"
                        >
                            {{ item.name }}
                        </a>
                    </li>
                </ul>
                <NuxtLink
                    class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
                    :to="data.internalLinks.usersUrl"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M11 8h2v1h-2zm0-4h2v1h-2zm0 6h2v1h-2z"></path>
                        <path
                            stroke="currentColor"
                            fill="none"
                            stroke-width="2"
                            d="M21 12V9a13.12 13.12 0 0 0-8.354 3h-1.292A13.12 13.12 0 0 0 3 9v3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v4a13.15 13.15 0 0 1 9 3.55A13.2 13.2 0 0 1 21 20v-4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
                        ></path>
                        <circle cx="9" cy="4" r="1" fill="currentColor"></circle>
                        <circle cx="15" cy="4" r="1" fill="currentColor"></circle>
                        <path
                            fill="currentColor"
                            d="M16 8H8a3.003 3.003 0 0 1-3-3V3a3.003 3.003 0 0 1 3-3h8a3.003 3.003 0 0 1 3 3v2a3.003 3.003 0 0 1-3 3M8 2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"
                        ></path>
                    </svg>

                    <span class="mx-2 text-sm font-medium">{{ data.text.machineLearning }}</span>
                </NuxtLink>

                <NuxtLink
                    class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
                    :to="data.internalLinks.settingsUrl"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"
                        ></path>
                    </svg>

                    <span class="mx-2 text-sm font-medium">{{ data.text.settings }}</span>
                </NuxtLink>

                <div class="p-3 bg-gray-100 rounded-lg">
                    <h2 class="text-sm font-medium text-gray-800">{{ data.text.featureTitle }}</h2>

                    <p class="mt-1 text-xs text-gray-500">
                        {{ data.text.featureText }}
                    </p>

                    <img
                        class="object-cover w-full h-32 mt-2 rounded-lg"
                        :src="data.externalLinks.featureImageUrl"
                        alt=""
                    />
                </div>
            </nav>
        </div>

        <div class="mt-6">
            <div class="flex items-center justify-between">
                <NuxtLink :to="data.internalLinks.userAvatarLink" class="flex items-center gap-x-2">
                    <img
                        class="object-cover rounded-full h-7 w-7"
                        :src="data.externalLinks.userAvatarUrl"
                        alt="avatar"
                    />
                    <span class="text-sm font-medium text-gray-700">{{ data.text.userName }}</span>
                </NuxtLink>

                <NuxtLink
                    @click.prevent="logout"
                    :to="data.internalLinks.logoutUrl"
                    class="text-gray-500 transition-colors duration-200 rotate-180 rtl:rotate-0 hover:text-primary-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                        />
                    </svg>
                </NuxtLink>
            </div>
        </div>
    </aside>
</template>
