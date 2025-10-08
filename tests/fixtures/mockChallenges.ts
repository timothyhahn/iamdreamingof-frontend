import type { DreamsForDay, Challenge } from '../../src/lib/dreams';

export const mockChallenge: Challenge = {
	words: [
		{ word: 'flying', type: 'gerund' },
		{ word: 'trees', type: 'object' },
		{ word: 'peace', type: 'concept' }
	],
	image_url_webp: '/test-image.webp',
	image_url_jpg: '/test-image.jpg',
	prompt: 'I was dreaming of flying through trees in peace'
};

export const mockDreamsForDay: DreamsForDay = {
	id: 1,
	date: '2024-01-15',
	challenges: {
		easy: {
			words: [
				{ word: 'swimming', type: 'gerund' },
				{ word: 'dogs', type: 'object' },
				{ word: 'happiness', type: 'concept' }
			],
			image_url_webp: '/easy.webp',
			image_url_jpg: '/easy.jpg',
			prompt: 'I was dreaming of swimming with dogs in happiness'
		},
		medium: {
			words: [
				{ word: 'running', type: 'gerund' },
				{ word: 'trees', type: 'object' },
				{ word: 'freedom', type: 'concept' }
			],
			image_url_webp: '/medium.webp',
			image_url_jpg: '/medium.jpg',
			prompt: 'I was dreaming of running by trees in freedom'
		},
		hard: {
			words: [
				{ word: 'dancing', type: 'gerund' },
				{ word: 'stars', type: 'object' },
				{ word: 'love', type: 'concept' }
			],
			image_url_webp: '/hard.webp',
			image_url_jpg: '/hard.jpg',
			prompt: 'I was dreaming of dancing under stars with love'
		},
		dreaming: mockChallenge
	}
};
