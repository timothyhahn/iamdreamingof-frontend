<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let showModal: boolean = true;
	let dialog: HTMLDialogElement;
	$: if (dialog && showModal) dialog.showModal();

	function closeModal() {
		showModal = false;
		dispatch('closeModal');
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	class="relative z-10"
	aria-labelledby="modal-title"
	aria-modal="true"
	bind:this={dialog}
	on:close={() => {
		closeModal();
	}}
	on:click|self={() => dialog.close()}
>
	<div class="fixed inset-0 z-10 w-screen overflow-y-auto font-medium text-left">
		<div class="flex min-h-full items-end justify-center p-10">
			<div
				class="w-screen lg:w-2/3 relative transform overflow-hidden rounded-lg dark:bg-iamdreamingof-800 dark:text-iamdreamingof-100 px-4 pb-4 pt-5 text-left shadow-xl"
			>
				<div class="absolute right-0 top-0 pr-4 pt-4">
					<button
						type="button"
						data-testid="close-modal"
						aria-label="Close modal"
						class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						on:click={() => dialog.close()}
					>
						<span class="sr-only">Close</span>
						<svg
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div class="">
					<div class="mt-3">
						<h1 class="text-2xl font-serif">A guide to "I am dreaming of..."</h1>
						<div class="mt-2">
							<p>I have provided an AI model three words which it uses to describe a scene.</p>
							<p>
								I have then given another AI model this description of a scene and asked it to
								generate an image.
							</p>
							<p>I'd like to give you a chance to guess what three words were originally given.</p>
							<p>
								You will be shown the image, as well as hints as to what kind of word each word is.
							</p>
							<p>
								In this example, the three words were "cakes", "elephants", and "forks". All three
								are objects.
							</p>

							<picture class="hidden md:block shadow-sm shadow-amber-50">
								<source srcset="/help-image-lg.webp" type="image/webp" />
								<source srcset="/help-image-lg.jpg" type="image/jpeg" />
								<img src="/help-image-lg.jpg" alt="The challenge presented" />
							</picture>

							<picture class="md:hidden block shadow-sm shadow-amber-50">
								<source srcset="/help-image-sm.webp" type="image/webp" />
								<source srcset="/help-image-sm.jpg" type="image/jpeg" />
								<img src="/help-image-sm.jpg" alt="The challenge presented" />
							</picture>

							<p>Below, there is an input textbox. Feel free to type in words that come to mind.</p>
							<p>
								As you type in words, you will see suggestions below. These suggestions are based on
								the bank of possible words the AI model was given.
							</p>
							<p>
								If a word does not pop up in the suggestions, it cannot be one of the three words.
							</p>
							<p>Click on a suggested word to see if it is one of the three words.</p>

							<picture class="hidden md:block shadow-sm shadow-amber-50">
								<source srcset="/help-guess-lg.webp" type="image/webp" />
								<source srcset="/help-guess-lg.jpg" type="image/jpeg" />
								<img src="/help-guess-lg.jpg" alt="The challenge presented" />
							</picture>

							<picture class="md:hidden block shadow-sm shadow-amber-50">
								<source srcset="/help-guess-sm.webp" type="image/webp" />
								<source srcset="/help-guess-sm.jpg" type="image/jpeg" />
								<img src="/help-guess-sm.jpg" alt="The challenge presented" />
							</picture>

							<p>
								Once all three words are revealed, you will be shown the original prompt, and the
								ability to move onto the next image, as a few "dreams" are generated each day.
							</p>
							<p>
								If at any time you'd like to reveal the three words, click the "Reveal" button and
								confirm your choice.
							</p>

							<picture class="hidden md:block shadow-sm shadow-amber-50">
								<source srcset="/help-reveal-lg.webp" type="image/webp" />
								<source srcset="/help-reveal-lg.jpg" type="image/jpeg" />
								<img src="/help-reveal-lg.jpg" alt="The challenge presented" />
							</picture>

							<picture class="md:hidden block shadow-sm shadow-amber-50">
								<source srcset="/help-reveal-sm.webp" type="image/webp" />
								<source srcset="/help-reveal-sm.jpg" type="image/jpeg" />
								<img src="/help-reveal-sm.jpg" alt="The challenge presented" />
							</picture>

							<p>
								Keep in mind that both the description model and image model are imperfect -
								sometimes the answer won't make sense.
							</p>
							<p>
								That's okay though - sometimes it makes the final result all the more interesting.
							</p>
							<p>(And of course, sometimes it's completely nonsensical.)</p>
							<p>
								If you need a refresher, there is a question mark button that you can click to see
								this message again.
							</p>

							<div class="flex items-center flex-col">
								<button
									on:click={() => dialog.close()}
									data-testid="dismiss-help"
									class="text-iamdreamingof-800 rounded bg-iamdreamingof-600 dark:bg-iamdreamingof-100 px-2 py-1 text-sm font-semibold shadow-sm hover:bg-white/20 dark:hover:bg-iamdreamingof-300 my-6"
									>Dismiss This Help</button
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</dialog>

<style>
	p {
		padding: 1rem 12px;
	}
</style>
