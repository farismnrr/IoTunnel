<template>
	<div class="pt-10" id="Footer">
		<div class="max-w-screen-xl mx-auto px-4 text-gray-600 dark:text-gray-400 md:px-8">
			<div class="space-y-6 sm:max-w-md sm:mx-auto sm:text-center">
				<a href="/" class="flex items-center sm:justify-center">
					<img src="@/assets/logo.svg" class="h-20" alt="IoTunnel Logo" />
				</a>
				<p>Nulla auctor metus vitae lectus iaculis, vel euismod massa efficitur.</p>
			</div>
			<div class="mt-10 py-10 border-t items-center justify-between sm:flex">
				<p>© 2022 Float UI Inc. All rights reserved.</p>
				<ul class="flex flex-wrap items-center gap-4 mt-6 sm:text-sm sm:mt-0">
					<li
						v-for="(item, idx) in footerNavs"
						:key="idx"
						class="text-gray-800 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 duration-150"
					>
						<a :href="item.href">{{ item.name }}</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			footerNavs: [
				{ href: "javascript:void()", name: "Terms" },
				{ href: "javascript:void()", name: "License" },
				{ href: "javascript:void()", name: "Privacy" },
				{ href: "javascript:void()", name: "About us" },
			],
		};
	},
};
</script>
