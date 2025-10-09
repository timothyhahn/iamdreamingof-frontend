<script>
	import '../app.css';
	import HelpModal from '$lib/components/HelpModal.svelte';
	let hasSeenHelp = localStorage.getItem('hasSeenHelp');
	let showModal = false;
	if (!hasSeenHelp) {
		localStorage.setItem('hasSeenHelp', 'true');
	}
	$: if (showModal && document) {
		document.body?.classList.add('overflow-hidden');
	} else {
		document.body?.classList.remove('overflow-hidden');
	}
</script>

{#if !showModal}
	<button
		class="rounded-full bg-iamdreamingof-600 text-iamdreamingof-100 w-8 h-8 mt-2 lg:mr-10 md:mr-5 mr-2 float-right"
		on:click={() => (showModal = true)}>?</button
	>
{/if}

<div class="clear-both"></div>
<div
	class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 font-medium dark:text-iamdreamingof-200 text-iamdreamingof-700"
>
	<div class="mx-auto max-w-3xl">
		<slot />

		<hr class="text-amber-50" />
		<div class="py-3">
			Made with 🤪 by <a
				href="https://github.com/timothyhahn/iamdreamingof-frontend"
				class="text-blue-600">Tim</a
			>
		</div>
	</div>
</div>

<HelpModal showModal={!hasSeenHelp || showModal} on:closeModal={() => (showModal = false)} />
