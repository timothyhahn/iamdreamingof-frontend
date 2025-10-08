<script lang="ts">
	import type { Word } from '$lib/dreams';
	import Guess from './Guess.svelte';

	export let answers: Word[];
	export let correctGuesses: string[];
</script>

<div data-testid="challenge-header">
	I am dreaming of
	<Guess answer={answers[0]} {correctGuesses} />,
	<Guess answer={answers[1]} {correctGuesses} />, and
	<Guess answer={answers[2]} {correctGuesses} />
</div>
