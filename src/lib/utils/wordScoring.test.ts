import { describe, it, expect } from 'vitest';
import { scoreWord, findBestMatch } from './wordScoring';

describe('scoreWord', () => {
	it('should give highest score (1000) for exact matches', () => {
		expect(scoreWord('dream', 'dream')).toBe(1000);
		expect(scoreWord('flying', 'flying')).toBe(1000);
	});

	it('should give high scores (800+) for prefix matches', () => {
		const score = scoreWord('dreaming', 'dream');
		expect(score).toBeGreaterThan(800);
		expect(score).toBeLessThan(900);

		// Longer prefix should score higher
		const score2 = scoreWord('dreams', 'dream');
		expect(score2).toBeGreaterThan(score);
	});

	it('should return 0 for very short inputs (1-2 chars) that are not prefixes', () => {
		expect(scoreWord('dream', 'x')).toBe(0);
		expect(scoreWord('dream', 'xy')).toBe(0);
		expect(scoreWord('dream', 'dr')).toBeGreaterThan(800); // This IS a prefix
	});

	it('should give moderate scores (300-450) for substring matches', () => {
		const score = scoreWord('dreaming', 'ream');
		expect(score).toBeGreaterThan(300);
		expect(score).toBeLessThan(450);

		// Earlier position should score higher
		const earlyScore = scoreWord('dreaming', 'rea');
		const lateScore = scoreWord('dreaming', 'ami');
		expect(earlyScore).toBeGreaterThan(lateScore);
	});

	it('should use Levenshtein distance for fuzzy matching on longer inputs', () => {
		// One character difference should still match
		const score = scoreWord('dream', 'drem');
		expect(score).toBeGreaterThan(0);
		expect(score).toBeLessThan(300);

		// Too many differences should not match
		const score2 = scoreWord('dream', 'xyz');
		expect(score2).toBe(0);
	});

	it('should be case insensitive', () => {
		// The function converts both inputs to lowercase for comparison
		expect(scoreWord('dream', 'dream')).toBe(1000);
		expect(scoreWord('Dream', 'dream')).toBe(1000);
		expect(scoreWord('dream', 'Dream')).toBe(1000);
		expect(scoreWord('DREAM', 'dream')).toBe(1000);
		expect(scoreWord('DrEaM', 'dReAm')).toBe(1000);
	});
});

describe('findBestMatch', () => {
	const wordList = [
		'dream',
		'dreaming',
		'flying',
		'falling',
		'swimming',
		'love',
		'peace',
		'harmony',
		'duck',
		'clouds'
	];

	it('should return null for empty input', () => {
		expect(findBestMatch(wordList, '')).toBe(null);
	});

	it('should find exact matches', () => {
		expect(findBestMatch(wordList, 'dream')).toBe('dream');
		expect(findBestMatch(wordList, 'flying')).toBe('flying');
	});

	it('should find prefix matches', () => {
		expect(findBestMatch(wordList, 'dre')).toBe('dream');
		expect(findBestMatch(wordList, 'fal')).toBe('falling');
		expect(findBestMatch(wordList, 'sw')).toBe('swimming');
	});

	it('should suggest for very short inputs if they are prefixes', () => {
		// 'd' matches both 'dream' and 'duck', but 'dream' comes first alphabetically
		const match = findBestMatch(wordList, 'd');
		expect(['dream', 'duck'].includes(match!)).toBe(true);

		expect(findBestMatch(wordList, 'x')).toBe(null);
		expect(findBestMatch(wordList, 'z')).toBe(null);
	});

	it('should find substring matches for longer inputs', () => {
		expect(findBestMatch(wordList, 'ream')).toBe('dream');
		expect(findBestMatch(wordList, 'loud')).toBe('clouds');
	});

	it('should handle fuzzy matches for typos', () => {
		// One character typo
		expect(findBestMatch(wordList, 'drem')).toBe('dream');
		expect(findBestMatch(wordList, 'flyng')).toBe('flying');

		// Should not match if too different
		expect(findBestMatch(wordList, 'xyz')).toBe(null);
	});

	it('should prefer exact matches over fuzzy matches', () => {
		const customList = ['cat', 'cart', 'car'];
		expect(findBestMatch(customList, 'car')).toBe('car');
	});

	it('should prefer prefix matches over substring matches', () => {
		const customList = ['dreaming', 'cream'];
		expect(findBestMatch(customList, 'dre')).toBe('dreaming');
	});
});
