<script lang="ts">
	import type { Challenge } from '$lib/dreams';

	export let challenge: Challenge;
</script>

<picture>
	<source type="image/webp" srcset={challenge.image_url_webp} />
	<source type="image/jpeg" srcset={challenge.image_url_jpg} />
	<img
		src={challenge.image_url_jpg}
		alt={challenge.prompt}
		class="shadow-sm shadow-iamdreamingof-500 rounded-sm"
	/>
</picture>
