<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	interface Props {
		onReveal?: () => void;
	}

	let { onReveal }: Props = $props();

	let revealInitiated = $state(false);
	let showButton = $state(false);

	function reveal() {
		if (onReveal) {
			onReveal();
		}
	}

	// Slowly show the reveal button after a delay
	onMount(() => {
		setTimeout(() => {
			showButton = true;
		}, 2000);
	});
</script>

{#if showButton}
	<div
		data-testid="reveal-container"
		class="flex flex-col content-center dark:text-iamdreamingof-700 text-iamdreamingof-100 text-sm"
		in:fade={{ duration: 1500, easing: quintOut }}
	>
		{#if revealInitiated}
			<div
				data-testid="reveal-confirmation"
				class="dark:text-iamdreamingof-400 text-iamdreamingof-700 mt-6 ml-auto mr-auto"
				in:fade={{ duration: 800, easing: quintOut }}
				out:fade={{ duration: 300 }}
			>
				Are you sure you want to reveal the answer?
			</div>
			<div in:scale={{ start: 0.8, duration: 600, delay: 200, easing: quintOut }}>
				<button
					onclick={reveal}
					data-testid="reveal-confirm-button"
					class="w-full rounded bg-red-950 px-2 py-1 text-sm text-white font-semibold shadow-sm hover:bg-red-600 my-6 dreamlike-transition hover:shadow-lg hover:shadow-red-600/30"
					>Reveal
				</button>
			</div>
		{:else}
			<button
				onclick={() => (revealInitiated = true)}
				data-testid="reveal-initial-button"
				class="rounded bg-iamdreamingof-600 dark:bg-iamdreamingof-100 px-2 py-1 text-sm font-semibold shadow-sm hover:bg-white/20 dark:hover:bg-iamdreamingof-300 my-6 dreamlike-transition opacity-80 hover:opacity-100"
				in:scale={{ start: 0.9, duration: 800, easing: quintOut }}
				>Reveal
			</button>
		{/if}
	</div>
{/if}
