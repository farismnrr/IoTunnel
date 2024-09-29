<script setup lang="ts">
import UserAuth from "~/components/Core/Authentication/UserAuth.vue";
import SidebarPanel from "~/components/UI/UserDashboard/SidebarPanel.vue";
import NavBar from "~/components/UI/UserDashboard/NavBar.vue";
import BottomNav from "~/components/UI/UserDashboard/BottomNav.vue";
import ComponentBar from "~/components/UI/UserDashboard/ComponentBar.vue";
</script>

<template>
    <header>
        <UserAuth />
        <section class="hidden md:block">
            <SidebarPanel />
        </section>
        <section class="md:hidden mt-20">
            <BottomNav />
            <!-- <NavBar /> -->
        </section>
    </header>
    <main class="md:pl-64">
        <ComponentBar />
    </main>
    <footer></footer>
</template>
