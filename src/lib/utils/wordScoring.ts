import { distance } from 'fastest-levenshtein';

/**
 * Scores a candidate word based on how well it matches the user's input
 * Higher scores indicate better matches
 * Case insensitive - both inputs are converted to lowercase
 */
export function scoreWord(candidate: string, input: string): number {
	// Make comparison case-insensitive
	candidate = candidate.toLowerCase();
	input = input.toLowerCase();

	// Exact match gets highest score
	if (candidate === input) return 1000;

	// Prefix match gets high score (longer prefix = higher score)
	if (candidate.startsWith(input)) {
		return 800 + (input.length / candidate.length) * 100;
	}

	// For very short inputs (1-2 chars), only consider prefix matches
	if (input.length <= 2) {
		return 0;
	}

	// Substring match gets moderate score
	if (candidate.includes(input)) {
		const position = candidate.indexOf(input);
		// Earlier position = higher score
		return 400 - position * 10 + (input.length / candidate.length) * 50;
	}

	// For longer inputs, use fuzzy matching with Levenshtein distance
	if (input.length >= 3) {
		const dist = distance(candidate, input);
		const maxLen = Math.max(candidate.length, input.length);
		const similarity = 1 - dist / maxLen;

		// Only consider if similarity is high enough
		if (similarity > 0.6) {
			return similarity * 300;
		}
	}

	return 0;
}

/**
 * Finds the best matching word from a word list based on the input
 */
export function findBestMatch(wordList: string[], input: string): string | null {
	if (!input) return null;

	// Score all words
	const scoredWords = wordList
		.map((word) => ({
			word,
			score: scoreWord(word, input)
		}))
		.filter((item) => item.score > 0)
		.sort((a, b) => b.score - a.score);

	// Return the best match if we found one
	if (scoredWords.length > 0) {
		// For exact or very close matches, return immediately
		if (scoredWords[0].score >= 800) {
			return scoredWords[0].word;
		}

		// For less confident matches, only suggest if input is long enough
		if (input.length >= 3 && scoredWords[0].score >= 200) {
			return scoredWords[0].word;
		}
	}

	return null;
}

/**
 * Scores and sorts words based on how well they match the input
 * Returns sorted array of words (best matches first)
 */
export function scoreAndSortWords(input: string, wordList: string[]): string[] {
	if (!input || !wordList || wordList.length === 0) return [];

	// Score all words and filter out non-matches
	const scoredWords = wordList
		.map((word) => ({
			word: word.toLowerCase(),
			score: scoreWord(word, input)
		}))
		.filter((item) => item.score > 0)
		.sort((a, b) => b.score - a.score);

	// Return just the words in sorted order
	return scoredWords.map((item) => item.word);
}
