export interface Word {
	word: string;
	type: string;
}
export interface Challenge {
	words: Word[];
	prompt: string;
	image_url_jpg: string;
	image_url_webp: string;
}

export interface Challenges {
	easy: Challenge;
	medium: Challenge;
	hard: Challenge;
	dreaming: Challenge;
}

export interface DreamsForDay {
	date: string;
	id: number;
	challenges: Challenges;
}
