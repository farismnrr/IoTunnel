<template>
    <div class="bg-white dark:bg-gray-900">
        <h1>Color mode: {{ $colorMode.value }}</h1>
        <select v-model="$colorMode.preference">
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="sepia">Sepia</option>
        </select>
        <img :src="logoSrc" alt="Logo" />
    </div>
</template>

<script setup>
const colorMode = useColorMode();

let logoSrc = computed(() => {
    if (colorMode.preference === "light") {
        return "/icons/logo.svg";
    } else if (colorMode.preference === "dark") {
        return "/icons/logo-dark.svg";
    } else {
        return "/icons/logo.svg"; // default logo
    }
});
</script>
