<script setup lang="ts">
import NavBar from "~/components/UI/LandingPage/NavBar.vue";
import Hero from "~/components/UI/LandingPage/Hero.vue";
import Feature from "~/components/UI/LandingPage/Feature.vue";
import Pricing from "~/components/UI/LandingPage/Pricing.vue";
import Testimonials from "~/components/UI/LandingPage/Testimonials.vue";
import CTA from "~/components/UI/LandingPage/CTA.vue";
import Contact from "~/components/UI/LandingPage/Contact.vue";
import Footer from "~/components/UI/LandingPage/Footer.vue";
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
