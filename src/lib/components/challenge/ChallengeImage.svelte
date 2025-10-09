<script lang="ts">
	import type { Challenge } from '$lib/dreams';
	import { navigating } from '$app/stores';

	interface Props {
		challenge: Challenge;
		onImageLoad?: () => void;
		isRevealed?: boolean;
	}

	let { challenge, onImageLoad, isRevealed = false }: Props = $props();

	let wrapperClass = $derived(isRevealed ? 'reveal-glow' : '');
	let imageLoaded = $state(false);

	function handleImageLoad() {
		imageLoaded = true;
		onImageLoad?.();
	}

	// Reset loading state when challenge changes
	$effect(() => {
		challenge; // Track challenge changes
		imageLoaded = false;
	});
</script>

<div class={wrapperClass}>
	<picture class:fade-out={$navigating}>
		<source type="image/webp" srcset={challenge.image_url_webp} />
		<source type="image/jpeg" srcset={challenge.image_url_jpg} />
		<img
			src={challenge.image_url_jpg}
			alt={challenge.prompt}
			class="shadow-sm shadow-iamdreamingof-500 rounded-sm h-5/6 w-5/6 ml-auto mr-auto dreamlike-transition image-placeholder"
			onload={handleImageLoad}
		/>
	</picture>
</div>

<style>
	.image-placeholder {
		min-height: 400px;
		aspect-ratio: 1;
		background: linear-gradient(
			135deg,
			var(--color-iamdreamingof-700) 0%,
			var(--color-iamdreamingof-600) 25%,
			var(--color-iamdreamingof-700) 50%,
			var(--color-iamdreamingof-600) 75%,
			var(--color-iamdreamingof-700) 100%
		);
		background-size: 400% 400%;
		animation: shimmer-bg 3s ease infinite;
	}

	@keyframes shimmer-bg {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	picture.fade-out {
		opacity: 0;
		transition: opacity 0.3s ease-out;
	}

	picture:not(.fade-out) {
		opacity: 1;
		transition: opacity 0.3s ease-in 0.1s;
	}
</style>
