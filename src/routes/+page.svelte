<script lang="ts">
	import objects from '../lists/objects.json';
	import gerunds from '../lists/gerunds.json';
	import concepts from '../lists/concepts.json';
	import { distance, closest } from 'fastest-levenshtein';
	import { onMount } from 'svelte';
	import { formatDate } from '$lib/date';

	export let word: string = '';
	const wordList = [...objects, ...gerunds, ...concepts];
	let data = {};
	let challenge = undefined;
	let guessedWords = [];
	let correctWords = [];
	let levels = ['easy', 'medium', 'hard', 'dreaming'];
	let currentLevel = 0;

	$: suggestion = closest(word, getObjects(wordList, word));
	$: showSuggestion = word.length > 0;
	$: challenge = data && 'challenges' in data ? data['challenges'][levels[currentLevel]] : null;
	$: answer = challenge ? challenge.words.map((word) => word.word) : [];
	$: words = challenge ? challenge.words : [];

	onMount(async () => {
		const res = await fetch(
			`https://iamdreamingof.nyc3.cdn.digitaloceanspaces.com/today.json?date=${formatDate(new Date())}`
		);
		data = await res.json();
	});

	// Returns what items are valid to calculate levenshtein distance with
	function getObjects(objects: string[], word: string) {
		if (word.length > 3) {
			return objects;
		} else {
			let filtered = objects.filter((obj) => obj.startsWith(word));
			if (filtered.length > 0) {
				return filtered;
			} else {
				return objects;
			}
		}
	}

	function acceptSuggestion() {
		word = suggestion;
		submitWord();
	}

	function submitWord() {
		if (answer.includes(word)) {
			correctWords = [...correctWords, word];
		} else {
			guessedWords = [...guessedWords, word];
		}
		word = '';
	}

	function getWord(idx: number, correct: string[]) {
		let wordthing = words[idx];
		if (correct.includes(wordthing.word)) {
			return wordthing.word;
		} else {
			return `(   ${wordthing.type}    )`;
		}
	}

	function reveal() {
		correctWords = answer;
	}

	function nextLevel() {
		if (currentLevel === levels.length - 1) {
			return;
		}
		currentLevel++;
		correctWords = [];
		guessedWords = [];
	}

	function getGuessedWords(guessedWords: string[]): string {
		if (guessedWords.length === 1) {
			return guessedWords[0];
		} else if (guessedWords.length === 2) {
			return `${guessedWords[0]} or ${guessedWords[1]}`;
		} else {
			return `${guessedWords.slice(0, -1).join(', ')}, or ${guessedWords.slice(-1)}`;
		}
	}
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
	<!-- We've used 3xl here, but feel free to try other max-widths based on your needs -->
	<div class="mx-auto max-w-3xl">
		<div class="py-3"></div>
		<!-- Content goes here -->
		{#if challenge}
			<picture class="shadow-lg">
				<source type="image/webp" srcset={challenge['image_url_webp']} />
				<source type="image/jpeg" srcset={challenge['image_url_jpeg']} />
				<img src={challenge['image_url_jpeg']} alt={challenge['description']} />
			</picture>
		{/if}
		{#if words && words.length > 0}
			<div class="dark:text-slate-300 text-3xl font-serif">
				I am dreaming of {getWord(0, correctWords)}, {getWord(1, correctWords)}, and {getWord(
					2,
					correctWords
				)}
			</div>
		{/if}
		<hr class="my-3" />
		{#if correctWords.length !== answer.length}
			<div class="mt-2">
				<input
					bind:value={word}
					placeholder="What am I dreaming of?"
					class="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-800 sm:text-sm sm:leading-6"
				/>
			</div>
			{#if showSuggestion}
				<div class="dark:text-white">
					<p>
						Perhaps you are thinking of
						<button on:click={acceptSuggestion} class="text-blue-300">{suggestion}</button>
					</p>
				</div>
			{/if}
		{/if}

		{#if guessedWords.length > 0}
			<div class="dark:text-slate-400 my-3">
				I don't think I was dreaming of {getGuessedWords(guessedWords)}...
			</div>
		{/if}

		{#if correctWords.length !== answer.length}
			<button
				on:click={reveal}
				class="rounded bg-white/10 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-white/20 my-6"
				>Reveal
			</button>
		{/if}

		{#if correctWords.length === answer.length && currentLevel < levels.length - 1}
			<button
				on:click={nextLevel}
				class="rounded bg-white/10 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-white/20 my-6"
				>Next Level
			</button>
		{/if}
	</div>
</div>
