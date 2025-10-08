<script lang="ts">
	import type { Challenge } from '$lib/dreams';

	interface Props {
		challenge: Challenge;
		onImageLoad?: () => void;
		isRevealed?: boolean;
	}

	let { challenge, onImageLoad, isRevealed = false }: Props = $props();

	let wrapperClass = $derived(isRevealed ? 'reveal-glow' : '');
</script>

<div class={wrapperClass}>
	<picture>
		<source type="image/webp" srcset={challenge.image_url_webp} />
		<source type="image/jpeg" srcset={challenge.image_url_jpg} />
		<img
			src={challenge.image_url_jpg}
			alt={challenge.prompt}
			class="shadow-sm shadow-iamdreamingof-500 rounded-sm h-5/6 w-5/6 ml-auto mr-auto dreamlike-transition"
			onload={onImageLoad}
		/>
	</picture>
</div>
