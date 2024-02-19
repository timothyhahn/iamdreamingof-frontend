function join(date, options, separator) {
	function format(option) {
		let formatter = new Intl.DateTimeFormat('en', option);
		return formatter.format(date);
	}
	return options.map(format).map((s) => s.padStart(2, '0')).join(separator);
}
export function formatDate(date: Date) {
	let options = [{year: 'numeric'}, {month: 'numeric'}, {day: 'numeric'}];
	let joined = join(new Date, options, '-');
	return joined
}