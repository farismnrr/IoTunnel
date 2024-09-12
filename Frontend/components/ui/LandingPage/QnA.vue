<script>
export default {
    data() {
        return {
            selectedFaq: null,
            faqs: [
                {
                    question: "What are some random questions to ask?",
                    answer: "That's exactly the reason we created this random question generator. There are hundreds of random questions to choose from so you're able to find the perfect random question."
                },
                {
                    question: "Do you include common questions?",
                    answer: "This generator doesn't include most common questions. The thought is that you can come up with common questions on your own so most of the questions in this generator."
                },
                {
                    question: "Can I use this for 21 questions?",
                    answer: "Yes! there are two ways that you can use this question generator depending on what you're after. You can indicate that you want 21 questions generated."
                },
                {
                    question: "Are these questions for girls or for boys?",
                    answer: "The questions in this generator are gender neutral and can be used to ask either male of females (or any other gender the person identifies with)."
                },
                {
                    question: "What do you wish you had more talent doing?",
                    answer: "If you've been searching for a way to get random questions, you've landed on the correct webpage. We created the Random Question Generator to ask you as many random questions as your heart desires."
                }
            ]
        };
    },
    methods: {
        toggleFaq(index) {
            this.selectedFaq = this.selectedFaq === index ? null : index;
        }
    }
};
</script>

<template>
    <section id="FAQs" class="leading-relaxed max-w-screen-xl mt-12 mx-auto px-4 md:px-8">
        <div class="max-w-screen-xl mx-auto px-4 text-gray-600 dark:text-gray-300 md:px-8">
            <div class="space-y-3 text-center">
                <h3 class="text-primary-600 dark:text-primary-400 font-semibold">FAQs</h3>
                <p class="text-3xl text-gray-800 dark:text-white font-semibold">
                    Frequently Asked Questions
                </p>
                <p class="text-gray-600 dark:text-gray-300 max-w-lg mx-auto text-lg">
                    Answered all frequently asked questions, Still confused? feel free to contact
                    us.
                </p>
            </div>
            <div class="mt-14 max-w-2xl mx-auto">
                <div
                    v-for="(item, index) in faqs"
                    :key="index"
                    class="space-y-3 mt-5 overflow-hidden border-b"
                    @click="toggleFaq(index)"
                >
                    <h4
                        class="cursor-pointer pb-5 flex items-center justify-between text-lg text-gray-700 dark:text-white font-medium"
                    >
                        {{ item.question }}
                        <svg
                            v-if="selectedFaq === index"
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-gray-500 dark:text-gray-300 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M20 12H4"
                            />
                        </svg>
                        <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-gray-500 dark:text-gray-300 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </h4>
                    <div
                        v-show="selectedFaq === index"
                        class="transition-[max-height,opacity] overflow-hidden duration-500 ease-in-out"
                        :style="{ maxHeight: selectedFaq === index ? '1000px' : '0px' }"
                    >
                        <div>
                            <p class="text-gray-500 dark:text-gray-300 pb-4">{{ item.answer }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
