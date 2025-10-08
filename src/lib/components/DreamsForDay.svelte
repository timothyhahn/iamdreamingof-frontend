<script lang="ts">
	import { onMount } from 'svelte';
	import { formatDate } from '$lib/date';
	import type { Challenge as ChallengeType, DreamsForDay } from '$lib/dreams';
	import Challenge from '$lib/components/challenge/Challenge.svelte';

	type dayId = 'today' | string;
	const LEVELS = ['easy', 'medium', 'hard', 'dreaming'];
	const BASE_URL = 'https://cdn.iamdreamingof.com';

	export let id: dayId = 'today';

	let currentLevel = 0;
	let day: DreamsForDay;
	let finished = false;
	let error: string;
	$: if (id && !finished) {
		loadDay();
	}
	$: challenges = day?.challenges;
	let currentChallenge: ChallengeType;
	$: switch (currentLevel) {
		case 0:
			currentChallenge = challenges?.easy;
			break;
		case 1:
			currentChallenge = challenges?.medium;
			break;
		case 2:
			currentChallenge = challenges?.hard;
			break;
		case 3:
			currentChallenge = challenges?.dreaming;
			break;
	}

	onMount(async () => {
		await loadDay();
	});

	async function loadDay() {
		if (id == null || (id !== 'today' && !id.match(/^\d{4}-\d{2}-\d{2}$/))) {
			console.error('Invalid date provided');
			error = 'Nothing found here...';
			return;
		}

		const url =
			id === 'today'
				? `${BASE_URL}/today.json?date=${formatDate(new Date())}`
				: `${BASE_URL}/days/${id}.json`;
		const res = await fetch(url);
		if (!res.ok) {
			console.error('Failed to fetch backend JSON', res.status);
			error = 'Nothing found here...';
			return;
		}
		currentLevel = 0;
		finished = false;
		error = '';
		day = await res.json();
	}

	function isFinalLevel() {
		return currentLevel >= LEVELS.length - 1;
	}

	function nextLevel() {
		if (isFinalLevel()) {
			return;
		}
		currentLevel++;
	}

	function finish() {
		finished = true;
	}
</script>

{#if error}
	<div class="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
		<div class="text-center">
			<div class="dark:text-iamdreamingof-200 my-3">
				{error}
			</div>
		</div>
	</div>
{:else if !finished}
	{#if currentChallenge}
		{@const isFinal = currentLevel >= LEVELS.length - 1}
		<Challenge
			challenge={currentChallenge}
			finalChallenge={isFinal}
			onNextLevel={nextLevel}
			onFinish={finish}
		/>
	{/if}
{:else}
	<!-- TODO: Would be much better to iterate over, but eh -->
	{#if challenges && day}
		<h1 class="text-sm text-iamdreamingof-300">What I dreamed of on {day.date}</h1>
		<Challenge challenge={challenges.dreaming} solved={true} />
		<Challenge challenge={challenges.hard} solved={true} />
		<Challenge challenge={challenges.medium} solved={true} />
		<Challenge challenge={challenges.easy} solved={true} />
	{:else}
		<div>Loading final results...</div>
	{/if}
	{#if id === 'today'}
		<div class="dark:text-iamdreamingof-200 my-3">
			I am done dreaming for today, come back tomorrow.
		</div>
	{/if}
{/if}
