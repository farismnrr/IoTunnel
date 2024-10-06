<script setup lang="ts">
import NavBar from "@/components/UI/LandingPage/NavBar.vue";
import Hero from "@/components/UI/LandingPage/Hero.vue";
import Feature from "@/components/UI/LandingPage/Feature.vue";
import Pricing from "@/components/UI/LandingPage/Pricing.vue";
import Testimonials from "@/components/UI/LandingPage/Testimonials.vue";
import CallToAction from "@/components/UI/LandingPage/CallToAction.vue";
import Contact from "@/components/UI/LandingPage/Contact.vue";
import FootBar from "@/components/UI/LandingPage/FootBar.vue";
</script>

<template>
    <header>
        <NavBar />
    </header>
    <main>
        <Hero />
        <Feature />
        <Pricing />
        <Testimonials />
        <CallToAction />
        <Contact />
    </main>
    <footer>
        <FootBar />
    </footer>
</template>
