<script lang="ts">
	export let incorrectGuesses: string[];

	function getGuessedWords(): string {
		if (incorrectGuesses.length === 1) {
			return incorrectGuesses[0];
		} else if (incorrectGuesses.length === 2) {
			return `${incorrectGuesses[0]} or ${incorrectGuesses[1]}`;
		} else {
			return `${incorrectGuesses.slice(0, -1).join(', ')}, or ${incorrectGuesses.slice(-1)}`;
		}
	}
</script>

<div class="dark:text-iamdreamingof-400 text-iamdreamingof-700 my-3">
	I don't think I was dreaming of {getGuessedWords()}...
</div>
