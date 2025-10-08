<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	interface Props {
		incorrectGuesses: string[];
	}

	let { incorrectGuesses }: Props = $props();

	let getGuessedWords = $derived((): string => {
		if (incorrectGuesses.length === 1) {
			return incorrectGuesses[0];
		} else if (incorrectGuesses.length === 2) {
			return `${incorrectGuesses[0]} or ${incorrectGuesses[1]}`;
		} else {
			return `${incorrectGuesses.slice(0, -1).join(', ')}, or ${incorrectGuesses.slice(-1)}`;
		}
	});
</script>

<div
	class="dark:text-iamdreamingof-300 text-iamdreamingof-600 opacity-90 dreamlike-transition"
	in:fade={{ duration: 800, easing: quintOut }}
	out:fade={{ duration: 400 }}
>
	<span in:slide={{ duration: 600, easing: quintOut }}>
		I don't think I was dreaming of <span class="italic opacity-80">{getGuessedWords()}</span>...
	</span>
</div>
