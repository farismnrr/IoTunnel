<script setup lang="ts">
import NavBar from "@/components/LandingPage/NavBar.vue";
import Hero from "@/components/LandingPage/Hero.vue";
import Features from "@/components/LandingPage/Feature.vue";
import Pricing from "@/components/LandingPage/Pricing.vue";
// import Testiomonials from "~/components/ui/LandingPage/Testiomonials.vue";
// import QnA from "~/components/ui/LandingPage/QnA.vue";
// import FooterBar from "~/components/ui/LandingPage/FooterBar.vue";
</script>

<template>
    <header>
        <NavBar />
    </header>
    <main class="dark:bg-gray-800">
        <Hero />
        <Features />
        <Pricing />
        <!-- <Testiomonials /> -->
        <!-- <QnA /> -->
    </main>
    <footer class="dark:bg-gray-800">
        <!-- <FooterBar /> -->
    </footer>
</template>
