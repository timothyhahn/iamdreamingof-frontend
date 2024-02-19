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
	$: dist = distance(word, suggestion);
	$: showSuggestion = word.length > 0;
	$: challenge = data && 'challenges' in data ? data['challenges'][levels[currentLevel]] : null;
	$: answer = challenge ? challenge.words.map((word) => word.word) : [];
	$: words = challenge ? challenge.words : [];

	onMount(async () => {
		const res = await fetch(`https://iamdreamingof.nyc3.cdn.digitaloceanspaces.com/today.json?date=${formatDate(new Date())}`);
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
</script>
{#if challenge}
	<picture>
		<source type="image/webp" srcset={challenge['image_url_webp']} />
		<source type="image/jpeg" srcset={challenge['image_url_jpeg']} />
		<img src={challenge['image_url_jpeg']} alt={challenge['description']} />
	</picture>
{/if}
{#if words && words.length > 0}
	I am dreaming of {getWord(0, correctWords)}, {getWord(1, correctWords)}, and {getWord(2, correctWords)}
{/if}
<input bind:value={word} placeholder="What am I dreaming of?" />
<button on:click={submitWord}>Submit</button>
{#if showSuggestion}
	<p>Perhaps you are thinking of
		<button on:click={acceptSuggestion}>{suggestion}</button>
	</p>
{/if}

<h3>Wrong Words</h3>
<ul>
	{#each guessedWords as word}
		<li>{word}</li>
	{/each}
</ul>

{#if correctWords.length !== answer.length}
	<button on:click={reveal}>Reveal</button>
{/if}

{#if correctWords.length === answer.length && currentLevel < levels.length - 1}
	<button on:click={nextLevel}>Next Level</button>
{/if}