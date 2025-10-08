<script lang="ts">
	import { scoreAndSortWords } from '$lib/utils/wordScoring';
	import { fade, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import ChallengeIncorrectGuesses from './ChallengeIncorrectGuesses.svelte';
	import gerunds from '../../../lists/gerunds.json';
	import objects from '../../../lists/objects.json';
	import concepts from '../../../lists/concepts.json';

	const ALL_WORDS = [...gerunds, ...objects, ...concepts];

	interface Props {
		guesses: string[];
		incorrectGuesses: string[];
		onSubmitWord: (word: string) => void;
		onTypingStart?: () => void;
		onTypingEnd?: () => void;
	}

	let { guesses, incorrectGuesses, onSubmitWord, onTypingStart, onTypingEnd }: Props = $props();

	let inputValue = $state('');
	let guessValue = $state('');
	let inputElement = $state<HTMLInputElement>();
	let unknownWord = $state('');
	let showUnknownWarning = $state(false);

	$effect(() => {
		if (inputElement) {
			inputElement.focus();
		}
	});

	$effect(() => {
		if (inputValue !== '') {
			onTypingStart?.();
			setGuess(inputValue);
			showUnknownWarning = false;
			unknownWord = '';
		} else {
			onTypingEnd?.();
			setGuess('');
		}
	});

	function submitGuess() {
		let wordToSubmit = suggestion || inputValue.trim().toLowerCase();

		if (wordToSubmit && wordToSubmit !== '') {
			if (!guesses.includes(wordToSubmit)) {
				// Check if it's a valid word we know about
				const isValidWord = ALL_WORDS.some((w) => w.toLowerCase() === wordToSubmit);

				if (suggestion || isValidWord) {
					onSubmitWord(wordToSubmit);
					inputValue = '';
				} else {
					// Show warning for unknown word
					unknownWord = wordToSubmit;
					showUnknownWarning = true;
					// Don't clear input value so user can edit their typo
					setTimeout(() => {
						showUnknownWarning = false;
					}, 3000);
				}
			} else {
				inputValue = '';
			}
		}
	}

	function setGuess(guess: string) {
		guessValue = guess;
	}

	function acceptSuggestion() {
		if (suggestion) {
			onSubmitWord(suggestion);
			inputValue = '';
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			if (suggestion) {
				event.preventDefault();
				acceptSuggestion();
			} else {
				submitGuess();
			}
		}
	}

	// Effect to clear unknown word warning when user starts typing something different
	$effect(() => {
		if (showUnknownWarning && inputValue.trim().toLowerCase() !== unknownWord) {
			showUnknownWarning = false;
			unknownWord = '';
		}
	});

	let suggestions = $derived.by(() => {
		if (!guessValue || guessValue.length === 0) return [];
		return scoreAndSortWords(guessValue, ALL_WORDS).filter((word) => !guesses.includes(word));
	});

	let showSuggestion = $derived(suggestions.length > 0 && inputValue.length > 0);
	let suggestion = $derived(showSuggestion ? suggestions[0] : '');
</script>

<!-- Suggestions and feedback section above input -->
<div class="min-h-[4rem] flex items-center justify-center relative">
	{#if showSuggestion && suggestion}
		<div
			class="dark:text-iamdreamingof-300 text-iamdreamingof-600 opacity-90 dreamlike-transition absolute inset-0 flex items-center justify-center"
			in:fade={{ duration: 400, easing: quintOut }}
			out:fade={{ duration: 200 }}
		>
			<span>Maybe I was dreaming of&nbsp;</span>
			<button
				onclick={acceptSuggestion}
				class="italic cursor-pointer hover:opacity-100 transition-opacity underline"
			>
				{suggestion}
			</button>
			<span>?</span>
		</div>
	{:else if unknownWord && showUnknownWarning}
		<div
			class="dark:text-iamdreamingof-300 text-iamdreamingof-600 opacity-90 dreamlike-transition absolute inset-0 flex items-center justify-center"
			in:fade={{ duration: 400, easing: quintOut }}
			out:fade={{ duration: 200 }}
		>
			<span>I don't know what&nbsp;</span>
			<span class="italic opacity-90">{unknownWord}</span>
			<span>&nbsp;means...</span>
		</div>
	{:else if incorrectGuesses.length > 0}
		<div class="absolute inset-0 flex items-center justify-center">
			<ChallengeIncorrectGuesses {incorrectGuesses} />
		</div>
	{/if}
</div>

<!-- Input section -->
<form
	onsubmit={(e) => {
		e.preventDefault();
		submitGuess();
	}}
>
	<input
		type="text"
		name="guess"
		autocomplete="off"
		bind:this={inputElement}
		bind:value={inputValue}
		onkeydown={handleKeydown}
		class="bg-white dark:bg-iamdreamingof-800 text-iamdreamingof-800 dark:text-iamdreamingof-100 rounded w-full py-2 text-center poppins-thin ring-0 focus:ring-1 ring-iamdreamingof-500 dark:ring-iamdreamingof-300 transition-all duration-500 dreamlike-transition"
		placeholder="What was I dreaming of?"
	/>
</form>
