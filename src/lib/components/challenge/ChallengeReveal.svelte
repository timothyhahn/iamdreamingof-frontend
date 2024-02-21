<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let revealInitiated = false;
	function reveal() {
		dispatch('reveal');
	}
</script>

<div
	class="flex flex-col content-center dark:text-iamdreamingof-700 text-iamdreamingof-100 text-sm"
>
	{#if revealInitiated}
		<div class="dark:text-iamdreamingof-400 text-iamdreamingof-700 mt-6">
			Are you sure you want to reveal the answer?
		</div>
		<button
			on:click={reveal}
			class="rounded bg-red-950 px-2 py-1 text-sm text-white font-semibold shadow-sm hover:bg-red-600 my-6"
			>Reveal
		</button>
	{:else}
		<button
			on:click={() => (revealInitiated = true)}
			class="rounded bg-iamdreamingof-600 dark:bg-iamdreamingof-100 px-2 py-1 text-sm font-semibold shadow-sm hover:bg-white/20 dark:hover:bg-iamdreamingof-300 my-6"
			>Reveal
		</button>
	{/if}
</div>
