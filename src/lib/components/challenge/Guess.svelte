<script lang="ts">
	import type { Word } from '$lib/dreams';
	import { Tooltip } from '@svelte-plugins/tooltips';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	interface Props {
		answer: Word;
		correctGuesses: string[];
	}

	let { answer, correctGuesses }: Props = $props();

	let isGuessed = $derived(correctGuesses.includes(answer.word));
	let previousIsGuessed = $state(false);
	let justGuessed = $state(false);

	$effect(() => {
		if (isGuessed && !previousIsGuessed) {
			previousIsGuessed = true;
			justGuessed = true;
			// Remove the glow effect after animation completes
			setTimeout(() => {
				justGuessed = false;
			}, 1800);
		}
	});

	function getTooltip(): string {
		switch (answer.type) {
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

{#if isGuessed}
	<span
		class="border-b-2 border-dashed px-3 dreamlike-transition {justGuessed ? 'word-glow' : ''}"
		in:fade={{ duration: 1200, easing: quintOut }}
	>
		{#if previousIsGuessed}
			<span in:fade={{ duration: 800, delay: 200 }} class="shimmer-text">
				{answer.word}
			</span>
		{:else}
			{answer.word}
		{/if}
	</span>
{:else}
	<Tooltip position="bottom" content={getTooltip()} arrow={false} animation="slide">
		<span
			class="border-b-2 border-dashed px-3 dark:text-iamdreamingof-400 text-iamdreamingof-200 opacity-60 dreamlike-transition hover:opacity-100"
		>
			({answer.type})
		</span>
	</Tooltip>
{/if}
