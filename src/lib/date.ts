function join(date: Date, options: Intl.DateTimeFormatOptions[], separator: string) {
	function format(option: Intl.DateTimeFormatOptions | undefined) {
		const formatter = new Intl.DateTimeFormat('en', option);
		return formatter.format(date);
	}
	return options
		.map(format)
		.map((s) => s.padStart(2, '0'))
		.join(separator);
}

export function formatDate(date: Date = new Date()) {
	const options: Intl.DateTimeFormatOptions[] = [
		{ year: 'numeric' },
		{ month: 'numeric' },
		{ day: 'numeric' }
	];
	return join(date, options, '-');
}
