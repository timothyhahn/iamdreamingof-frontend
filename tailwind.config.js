/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				iamdreamingof: {
					50: '#EBE9F1',
					100: '#D7D3E3',
					200: '#ACA5C5',
					300: '#8479A9',
					400: '#5F5483',
					500: '#3E3756',
					600: '#322C44',
					700: '#262235',
					800: '#191622',
					900: '#0E0C13',
					950: '#070609'
				}
			}
		}
	},
	plugins: []
};
