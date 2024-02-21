<script lang="ts">
	import type { Challenge, Word } from '$lib/dreams';
	import ChallengeHeader from '$lib/components/challenge/ChallengeHeader.svelte';
	import ChallengeImage from '$lib/components/challenge/ChallengeImage.svelte';
	import ChallengeGuesser from '$lib/components/challenge/ChallengeGuesser.svelte';
	import ChallengeIncorrectGuesses from '$lib/components/challenge/ChallengeIncorrectGuesses.svelte';
	import ChallengeReveal from '$lib/components/challenge/ChallengeReveal.svelte';
	import ChallengePrompt from '$lib/components/challenge/ChallengePrompt.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let challenge: Challenge;
	export let finalChallenge: boolean = false;
	export let solved: boolean = false;

	let answers: Word[] = challenge.words;
	let correctGuesses: string[] = solved ? answers.map((word) => word.word) : [];
	let incorrectGuesses: string[] = [];

	// On new challenge, reset the state
	$: if (challenge) {
		answers = challenge.words;
		correctGuesses = solved ? answers.map((word) => word.word) : [];
		incorrectGuesses = [];
	}

	$: challengeComplete = correctGuesses.length == answers.length;

	$: if (challengeComplete && finalChallenge) {
		dispatch('finish');
	}

	function nextLevel() {
		dispatch('nextLevel');
	}

	function reveal() {
		correctGuesses = answers.map((word) => word.word);
	}
	function submitWord(event) {
		let word: string = event.detail.word;
		if (answers.some((word) => word.word === event.detail.word)) {
			correctGuesses = [...correctGuesses, word];
		} else {
			incorrectGuesses = [...incorrectGuesses, word];
		}
	}
</script>

<div
	class="dark:text-iamdreamingof-200 text-iamdreamingof-500 text-3xl annapurna-sil-regular pb-6 text-center"
	style="line-height: 5rem;"
>
	<ChallengeHeader {answers} {correctGuesses} />
</div>
<div>
	<ChallengeImage {challenge} />

	<hr class="my-3 px-6" />

	<span class="poppins-medium">
		{#if challengeComplete}
			<ChallengePrompt prompt={challenge.prompt} />
			{#if !finalChallenge && !solved}
				<div
					class="flex flex-col content-center dark:text-iamdreamingof-700 text-iamdreamingof-100"
				>
					<button
						on:click={nextLevel}
						class="rounded bg-iamdreamingof-600 dark:bg-iamdreamingof-100 px-2 py-1 text-sm font-semibold dark:text-iamdreamingof-700 text-white shadow-sm dark:hover:bg-iamdreamingof-300 my-6"
						>Next Dream
					</button>
				</div>
			{/if}
		{:else}
			<ChallengeGuesser
				guesses={incorrectGuesses.concat(correctGuesses)}
				on:submitWord={submitWord}
			/>
			{#if incorrectGuesses.length > 0}
				<ChallengeIncorrectGuesses {incorrectGuesses} />
			{/if}
			<ChallengeReveal on:reveal={reveal} />
		{/if}
	</span>
</div>
