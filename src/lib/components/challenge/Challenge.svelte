<script lang="ts">
	import type { Challenge, Word } from '$lib/dreams';
	import ChallengeHeader from '$lib/components/challenge/ChallengeHeader.svelte';
	import ChallengeImage from '$lib/components/challenge/ChallengeImage.svelte';
	import ChallengeGuesser from '$lib/components/challenge/ChallengeGuesser.svelte';
	import ChallengeIncorrectGuesses from '$lib/components/challenge/ChallengeIncorrectGuesses.svelte';
	import ChallengeReveal from '$lib/components/challenge/ChallengeReveal.svelte';
	import ChallengePrompt from '$lib/components/challenge/ChallengePrompt.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { fade, blur, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	interface Props {
		challenge: Challenge;
		finalChallenge?: boolean;
		solved?: boolean;
		onFinish?: () => void;
		onNextLevel?: () => void;
	}

	let {
		challenge,
		finalChallenge = false,
		solved = false,
		onFinish,
		onNextLevel
	}: Props = $props();

	let answers = $state(challenge.words);
	let correctGuesses = $state(solved ? challenge.words.map((word) => word.word) : []);
	let incorrectGuesses = $state<string[]>([]);
	let wasCompleteOnLastKeypress = $state(false);
	let backgroundBlur = $state(0);
	let isTyping = $state(false);
	let imageLoaded = $state(false);
	let isRevealed = $state(false);

	// Track challenge changes by prompt (unique identifier)
	let lastChallengePrompt = challenge.prompt;

	// Update state when challenge changes
	$effect(() => {
		if (challenge.prompt !== lastChallengePrompt) {
			lastChallengePrompt = challenge.prompt;
			answers = challenge.words;
			correctGuesses = solved ? challenge.words.map((word) => word.word) : [];
			incorrectGuesses = [];
			wasCompleteOnLastKeypress = false;
			isRevealed = false;
			imageLoaded = false;
			setTimeout(() => {
				imageLoaded = true;
			}, 500);
		}
	});

	let challengeComplete = $derived(correctGuesses.length === answers.length);

	$effect(() => {
		if (challengeComplete && !isRevealed) {
			// Trigger reveal animation when challenge is completed
			isRevealed = true;

			if (finalChallenge && onFinish) {
				onFinish();
			}
		}
	});

	function nextLevel() {
		if (onNextLevel) {
			onNextLevel();
		}
	}

	function reveal() {
		correctGuesses = answers.map((word) => word.word);
		isRevealed = true;

		// When revealing the final challenge, trigger finish with minimal delay
		if (finalChallenge && onFinish) {
			setTimeout(() => {
				onFinish();
			}, 500);
		}
	}
	function submitWord(word: string) {
		if (answers.some((answer) => answer.word === word)) {
			correctGuesses = [...correctGuesses, word];
			// Mark that we just completed the challenge
			if (correctGuesses.length === answers.length) {
				wasCompleteOnLastKeypress = true;
				// Reset the flag after a short delay
				setTimeout(() => {
					wasCompleteOnLastKeypress = false;
				}, 100);
			}
		} else {
			incorrectGuesses = [...incorrectGuesses, word];
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		// Gentle background reaction to typing
		if (!challengeComplete && event.key.length === 1) {
			isTyping = true;
			backgroundBlur = Math.min(backgroundBlur + 0.5, 4);
			setTimeout(() => {
				backgroundBlur = Math.max(backgroundBlur - 0.5, 0);
				isTyping = false;
			}, 300);
		}

		// When challenge is complete and Enter is pressed, go to next level
		// But not if we just completed it on this keypress
		if (
			event.key === 'Enter' &&
			challengeComplete &&
			!finalChallenge &&
			!solved &&
			!wasCompleteOnLastKeypress
		) {
			nextLevel();
		}
	}

	function onTypingStart() {
		isTyping = true;
		backgroundBlur = 2;
	}

	function onTypingEnd() {
		isTyping = false;
		setTimeout(() => {
			if (!isTyping) backgroundBlur = 0;
		}, 500);
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeydown);
	});
	function onImageLoad() {
		imageLoaded = true;
	}
</script>

<!-- Dreamlike background texture -->
<div class="fixed inset-0 pointer-events-none dream-background opacity-50"></div>

<!-- Blur effect layer -->
<div
	class="fixed inset-0 pointer-events-none transition-all duration-1000 ease-out"
	style="backdrop-filter: blur({backgroundBlur}px)"
></div>

<div in:fade={{ duration: 1500, easing: quintOut }} class="relative">
	<div
		class="dark:text-iamdreamingof-200 text-iamdreamingof-500 text-3xl font-serif pb-6 text-center dreamlike-transition"
		style="line-height: 5rem;"
		in:fly={{ y: -20, duration: 1200, delay: 300, easing: quintOut }}
	>
		<ChallengeHeader {answers} {correctGuesses} />
	</div>
	<div in:fade={{ duration: 1000, delay: 600 }}>
		<ChallengeImage {challenge} {onImageLoad} {isRevealed} />

		<hr class="my-3 px-6 dreamlike-transition" in:fade={{ duration: 800, delay: 900 }} />

		<div class="font-medium">
			{#if challengeComplete}
				<div data-testid="challenge-complete" in:fade={{ duration: finalChallenge ? 0 : 1200, easing: quintOut }}>
					<ChallengePrompt prompt={challenge.prompt} />
					{#if !finalChallenge && !solved}
						<div
							class="flex flex-col content-center dark:text-iamdreamingof-700 text-iamdreamingof-100"
							in:fade={{ duration: 800, delay: 400 }}
						>
							<button
								onclick={nextLevel}
								data-testid="next-dream-button"
								class="rounded bg-iamdreamingof-600 dark:bg-iamdreamingof-100 px-2 py-1 text-sm font-semibold dark:text-iamdreamingof-700 text-white shadow-sm dark:hover:bg-iamdreamingof-300 my-6 dreamlike-transition pulse-animation"
								aria-label="Next Dream (Press Enter)"
								>Next Dream
							</button>
						</div>
					{/if}
				</div>
			{:else}
				{#if imageLoaded}
					<div in:fade={{ duration: 800, delay: 200 }}>
						<ChallengeGuesser
							guesses={incorrectGuesses.concat(correctGuesses)}
							{incorrectGuesses}
							onSubmitWord={submitWord}
							{onTypingStart}
							{onTypingEnd}
						/>
					</div>
				{/if}
				<ChallengeReveal onReveal={reveal} />
			{/if}
		</div>
	</div>
</div>
