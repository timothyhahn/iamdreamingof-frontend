import { describe, it, expect } from 'vitest';
import type { Word } from '$lib/dreams';

describe('Guess Component Logic', () => {
	const mockAnswer: Word = {
		word: 'dreaming',
		type: 'gerund'
	};

	describe('isGuessed logic', () => {
		it('should return true when word is in correctGuesses', () => {
			const correctGuesses = ['dreaming', 'flying'];
			const isGuessed = correctGuesses.includes(mockAnswer.word);
			expect(isGuessed).toBe(true);
		});

		it('should return false when word is not in correctGuesses', () => {
			const correctGuesses = ['flying', 'swimming'];
			const isGuessed = correctGuesses.includes(mockAnswer.word);
			expect(isGuessed).toBe(false);
		});

		it('should return false for empty correctGuesses', () => {
			const correctGuesses: string[] = [];
			const isGuessed = correctGuesses.includes(mockAnswer.word);
			expect(isGuessed).toBe(false);
		});
	});

	describe('tooltip text generation', () => {
		function getTooltip(answer: Word): string {
			switch (answer.type) {
				case 'object':
					return 'A concrete noun, like a duck';
				case 'gerund':
					return 'A verb ending in -ing, like dreaming';
				case 'concept':
					return 'An abstract concept, like love';
				default:
					return "I don't know what this is";
			}
		}

		it('should return correct tooltip for gerund', () => {
			const answer: Word = { word: 'dreaming', type: 'gerund' };
			expect(getTooltip(answer)).toBe('A verb ending in -ing, like dreaming');
		});

		it('should return correct tooltip for object', () => {
			const answer: Word = { word: 'duck', type: 'object' };
			expect(getTooltip(answer)).toBe('A concrete noun, like a duck');
		});

		it('should return correct tooltip for concept', () => {
			const answer: Word = { word: 'love', type: 'concept' };
			expect(getTooltip(answer)).toBe('An abstract concept, like love');
		});

		it('should handle unknown types', () => {
			const answer: Word = { word: 'unknown', type: 'unknown' as any };
			expect(getTooltip(answer)).toBe("I don't know what this is");
		});
	});

	describe('display logic', () => {
		it('should show word type when not guessed', () => {
			const isGuessed = false;
			const displayText = isGuessed ? mockAnswer.word : `(${mockAnswer.type})`;
			expect(displayText).toBe('(gerund)');
		});

		it('should show actual word when guessed', () => {
			const isGuessed = true;
			const displayText = isGuessed ? mockAnswer.word : `(${mockAnswer.type})`;
			expect(displayText).toBe('dreaming');
		});
	});

	describe('style classes', () => {
		it('should apply opacity class when not guessed', () => {
			const isGuessed = false;
			const classes = `border-b-2 border-dashed px-3 dreamlike-transition ${
				isGuessed ? '' : 'opacity-60'
			}`.trim();
			expect(classes).toContain('opacity-60');
		});

		it('should not apply opacity class when guessed', () => {
			const isGuessed = true;
			const classes = `border-b-2 border-dashed px-3 dreamlike-transition ${
				isGuessed ? '' : 'opacity-60'
			}`.trim();
			expect(classes).not.toContain('opacity-60');
		});
	});
});
