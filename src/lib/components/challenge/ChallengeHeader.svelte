<script lang="ts">
	import type { Word } from '$lib/dreams';
	import { Tooltip } from '@svelte-plugins/tooltips';

	export let answers: Word[];
	export let correctGuesses: string[];

	function wasCorrectlyGuessed(idx: number, guesses: string[]) {
		return guesses.includes(answers[idx].word);
	}

	function getTooltip(idx: number): string {
		switch (answers[idx].type) {
			case 'object':
				return 'A concrete noun, like a duck';
			case 'gerund':
				return 'A verb ending in -ing, like dreaming';
			case 'concept':
				return 'An abstract concept, like love';
			default:
				return "I don't know what this is";
		}
	}
</script>

<div>
	I am dreaming of
	{#if wasCorrectlyGuessed(0, correctGuesses)}
		<span class="border-b-2 border-dashed px-3">{answers[0].word}</span>
	{:else}
		<Tooltip position="bottom" content={getTooltip(0)} arrow={false} animation="slide">
			<span class="border-b-2 border-dashed px-3 dark:text-iamdreamingof-400 text-iamdreamingof-200"
				>({answers[0].type})</span
			>
		</Tooltip>
	{/if}
	,
	{#if wasCorrectlyGuessed(1, correctGuesses)}
		<span class="border-b-2 border-dashed px-3">{answers[1].word}</span>
	{:else}
		<Tooltip position="bottom" content={getTooltip(1)} arrow={false} animation="slide">
			<span class="border-b-2 border-dashed px-3 dark:text-iamdreamingof-400 text-iamdreamingof-200"
				>({answers[1].type})</span
			>
		</Tooltip>
	{/if}
	, and
	{#if wasCorrectlyGuessed(2, correctGuesses)}
		<span class="border-b-2 border-dashed px-3">{answers[2].word}</span>
	{:else}
		<Tooltip position="bottom" content={getTooltip(2)} arrow={false} animation="slide">
			<span class="border-b-2 border-dashed px-3 dark:text-iamdreamingof-400 text-iamdreamingof-200"
				>({answers[2].type})</span
			>
		</Tooltip>
	{/if}
</div>
