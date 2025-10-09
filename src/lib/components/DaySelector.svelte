<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let id: string;

	type Day = {
		date: string;
		id: string;
	};

	type Days = {
		days: Day[];
	};

	let days: Day[] = [];
	onMount(async () => {
		const res = await fetch('https://cdn.iamdreamingof.com/days.json');
		const json: Days = await res.json();

		const today = new Date().toISOString().split('T')[0];
		days = json.days.filter((day) => day.date !== today);
	});

	function selectDay(event: Event) {
		const target = event.target as HTMLSelectElement;
		const selectedDay = target.value;
		if (target.value === 'today') {
			goto('/');
			return;
		}
		goto(`/days?id=${selectedDay}`);
	}
</script>

<div class="py-3">
	<select
		id="location"
		name="location"
		class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 bg-iamdreamingof-100 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
		on:change={selectDay}
	>
		{#each days as day}
			<option value={day.date} selected={id === day.date}>{day.date}</option>
		{/each}
		<option selected={id === 'today'} value="today">Today</option>
	</select>
</div>
