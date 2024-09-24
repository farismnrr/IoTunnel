<script setup lang="ts">
import NavBar from "~/components/LandingPage/NavBar.vue";
import Hero from "~/components/LandingPage/Hero.vue";
import Feature from "~/components/LandingPage/Feature.vue";
import Pricing from "~/components/LandingPage/Pricing.vue";
import Testimonials from "~/components/LandingPage/Testimonials.vue";
import CTA from "~/components/CTA.vue";
import Contact from "~/components/LandingPage/Contact.vue";
import Footer from "~/components/LandingPage/Footer.vue";
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
        <CTA />
        <Contact />
    </main>
    <footer>
        <Footer />
    </footer>
</template>
