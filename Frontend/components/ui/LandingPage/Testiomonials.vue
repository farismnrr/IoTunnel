<template>
	<section class="py-14" id="Testimonials">
		<div class="max-w-screen-xl mx-auto px-4 md:px-8">
			<div class="max-w-xl mx-auto space-y-3 text-center">
				<h3 class="text-primary-600 dark:text-primary-400 font-semibold">Testimonials</h3>
				<p class="text-gray-800 dark:text-white text-3xl font-semibold sm:text-4xl">
					See what others saying about us
				</p>
				<p class="mt-3 text-gray-600 dark:text-gray-300">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et est hendrerit,
					porta nunc vitae, gravida justo. Nunc fermentum magna lorem, euismod volutpat
					arcu volutpat et.
				</p>
			</div>
			<div class="mt-12">
				<ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					<li
						v-for="(item, idx) in testimonials"
						:key="idx"
						class="bg-gray-100 p-4 rounded-xl"
					>
						<figure>
							<div class="flex items-center gap-x-4">
								<img :src="item.avatar" class="w-16 h-16 rounded-full" />
								<div>
									<span class="block text-gray-800 font-semibold">{{
										item.name
									}}</span>
									<span class="block text-gray-600 text-sm mt-0.5">{{
										item.title
									}}</span>
								</div>
							</div>
							<blockquote>
								<p class="mt-6 text-gray-700">
									{{ item.quote }}
								</p>
							</blockquote>
						</figure>
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	data() {
		return {
			testimonials: [
				{
					avatar: "https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg",
					name: "Martin escobar",
					title: "Founder of meta",
					quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et est hendrerit, porta nunc vitae.",
				},
				{
					avatar: "https://randomuser.me/api/portraits/women/79.jpg",
					name: "Angela stian",
					title: "Product designer",
					quote: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
				},
				{
					avatar: "https://randomuser.me/api/portraits/men/86.jpg",
					name: "Karim ahmed",
					title: "DevOp engineer",
					quote: "There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain.",
				},
			],
		};
	},
};
</script>
