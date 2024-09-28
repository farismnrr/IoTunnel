<script setup lang="ts">
import UserAuth from "~/components/Core/Authentication/UserAuth.vue";
import SidebarPanel from "~/components/UI/UserDashboard/SidebarPanel.vue";
</script>

<template>
    <header>
        <UserAuth />
        <SidebarPanel />
    </header>
    <main></main>
    <footer></footer>
</template>
