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
	let revealInitiated = false;
	let levels = ['easy', 'medium', 'hard', 'dreaming'];
	let currentLevel = 0;

	$: suggestion = closest(word, getObjects(wordList, word));
	$: showSuggestion = word.length > 0;
	$: challenge = data && 'challenges' in data ? data['challenges'][levels[currentLevel]] : null;
	$: answer = challenge ? challenge.words.map((word) => word.word) : [];
	$: words = challenge ? challenge.words : [];
	$: originalPrompt = challenge ? challenge.prompt : '';
	$: challengeComplete = correctWords.length === answer.length;

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
		if (isCorrect(idx, correct)) {
			return wordthing.word;
		} else {
			return `(${wordthing.type})`;
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
		revealInitiated = false;
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

	function isCorrect(idx: number, correct: string[]) {
		let wordthing = words[idx];
		return correct.includes(wordthing.word);
	}

	function getTooltip(idx: number, correctWords: string[]) {
		let tooltipFor = getWord(idx, correctWords);
		if (tooltipFor === '(object)') {
			return 'A concrete noun, like a duck or a hotel.';
		} else if (tooltipFor === '(gerund)') {
			return 'A verb that ends in -ing, like dreaming or building.';
		} else if (tooltipFor === '(concept)') {
			return 'An abstract noun, like liberty or death.';
		} else {
			return null;
		}
	}
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 poppins-medium dark:text-iamdreamingof-200 text-iamdreamingof-700">
	<div class="mx-auto max-w-3xl">
		{#if words && words.length > 0}
			<div
				class="dark:text-iamdreamingof-200 text-iamdreamingof-500 text-3xl annapurna-sil-regular pb-6 text-center"
				style="line-height: 5rem;"
			>
				I am dreaming of
				<span
					class="border-b-2 border-dashed px-3 {!isCorrect(0, correctWords)
								? 'dark:text-iamdreamingof-400 text-iamdreamingof-200'
								: ''}"
				>
							{getWord(0, correctWords)}
						</span>
				,
				<span
					class="border-b-2 border-dashed px-3 {!isCorrect(1, correctWords)
								? 'dark:text-iamdreamingof-400 text-iamdreamingof-200'
								: ''}">{getWord(1, correctWords)}</span
				>
				, and

				<span
					class="border-b-2 border-dashed px-3 {!isCorrect(2, correctWords)
								? 'dark:text-iamdreamingof-400 text-iamdreamingof-200'
								: ''}">{getWord(2, correctWords)}</span
				>
				.
			</div>
		{/if}
		{#if challenge}
			<picture>
				<source type="image/webp" srcset={challenge['image_url_webp']} />
				<source type="image/jpeg" srcset={challenge['image_url_jpeg']} />
				<img
					src={challenge['image_url_jpeg']}
					alt={challenge['description']}
					class="shadow-sm shadow-iamdreamingof-500 rounded-sm"
				/>
			</picture>
		{/if}
		<hr class="my-3" />

		{#if correctWords.length !== answer.length}
			<div class="mt-2">
				<input
					bind:value={word}
					placeholder="What am I dreaming of?"
					class="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-iamdreamingof-800 sm:text-sm sm:leading-6"
				/>
			</div>
			{#if showSuggestion}
				<div class="dark:text-iamdreamingof-100 text-iamdreamingof-800">
					<p>
						Perhaps you are thinking of
						<button on:click={acceptSuggestion}
										class="text-blue-300 rounded shadow-sm hover bg-white/10 px-3 my-3">{suggestion}</button>
					</p>
				</div>
			{/if}
		{/if}

		{#if guessedWords.length > 0 && !challengeComplete}
			<div class="dark:text-iamdreamingof-400 text-iamdreamingof-700 my-3">
				I don't think I was dreaming of {getGuessedWords(guessedWords)}...
			</div>
		{/if}

		<div class="flex flex-col content-center dark:text-iamdreamingof-700 text-iamdreamingof-100">
			{#if !challengeComplete && !revealInitiated}
				<button
					on:click={() => (revealInitiated = true)}
					class="rounded bg-iamdreamingof-600 dark:bg-iamdreamingof-100 px-2 py-1 text-sm font-semibold shadow-sm hover:bg-white/20 dark:hover:bg-iamdreamingof-300 my-6"
				>Reveal
				</button>
			{/if}
			{#if !challengeComplete && revealInitiated}
				<div class="dark:text-iamdreamingof-400 text-iamdreamingof-700 mt-6">Are you sure you want to reveal the
					answer?
				</div>
				<button
					on:click={reveal}
					class="rounded bg-red-950 px-2 py-1 text-sm text-white font-semibold shadow-sm hover:bg-red-600 my-6"
				>Reveal
				</button>
			{/if}
			{#if challengeComplete && originalPrompt}
				<div class="dark:text-iamdreamingof-400 text-iamdreamingof-700 my-3">
					{originalPrompt}
				</div>
			{/if}

			{#if challengeComplete && currentLevel < levels.length - 1}
				<button
					on:click={nextLevel}
					class="rounded bg-iamdreamingof-600 dark:bg-iamdreamingof-100 px-2 py-1 text-sm font-semibold dark:text-iamdreamingof-700 text-white shadow-sm dark:hover:bg-iamdreamingof-300 my-6"
				>Next Dream
				</button>
			{/if}
			{#if challengeComplete && currentLevel >= levels.length - 1}
				<div class="dark:text-iamdreamingof-200 my-3">
					I am done dreaming for today, come back tomorrow.
				</div>
			{/if}
		</div>
	</div>
</div>
