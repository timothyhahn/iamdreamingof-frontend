<script lang="ts">
	import type { PageData } from './$types';
	import DreamsForDay from '$lib/components/DreamsForDay.svelte';
	import DaySelector from '$lib/components/DaySelector.svelte';
	export let data: PageData;
	$: id = data.id || '';
</script>

<div class="clear-both"></div>
<DreamsForDay {id} />
<DaySelector {id} />
