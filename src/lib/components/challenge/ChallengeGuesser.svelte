<script lang="ts">
	import objects from '../../../lists/objects.json';
	import gerunds from '../../../lists/gerunds.json';
	import concepts from '../../../lists/concepts.json';
	import { closest } from 'fastest-levenshtein';
	import { createEventDispatcher } from 'svelte';

	const wordList = [...objects, ...gerunds, ...concepts];
	const dispatch = createEventDispatcher();
	export let guesses: string[];

	let word: string = '';

	$: suggestion = closest(word.toLowerCase(), getObjects(wordList, word.toLowerCase()));
	$: showSuggestion = word.length > 0;

	function getObjects(objects: string[], word: string) {
		if (objects.includes(word)) {
			return [word];
		}
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
		if (guesses.includes(suggestion)) {
			return;
		}
		dispatch('submitWord', {
			word: suggestion
		});
		word = '';
	}
</script>

<div>
	<div class="mt-2">
		<input
			bind:value={word}
			placeholder="What am I dreaming of?"
			class="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-iamdreamingof-800 sm:text-sm sm:leading-6"
		/>
	</div>

	{#if showSuggestion}
		<div class="dark:text-iamdreamingof-100 text-iamdreamingof-800 text-base">
			<p>
				Perhaps you are thinking of
				<button
					on:click={acceptSuggestion}
					class="text-blue-300 rounded shadow-sm hover bg-white/10 px-3 my-3">{suggestion}</button
				>
			</p>
		</div>
	{/if}
</div>
