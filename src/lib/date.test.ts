import { describe, it, expect } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
	it('should format dates in YYYY-MM-DD format', () => {
		const testDate = new Date('2024-01-15T12:00:00Z');
		const formatted = formatDate(testDate);
		expect(formatted).toBe('2024-01-15');
	});

	it('should handle single digit months correctly', () => {
		const testDate = new Date('2024-03-05T12:00:00Z');
		const formatted = formatDate(testDate);
		expect(formatted).toBe('2024-03-05');
	});

	it('should handle single digit days correctly', () => {
		const testDate = new Date('2024-12-01T12:00:00Z');
		const formatted = formatDate(testDate);
		expect(formatted).toBe('2024-12-01');
	});

	it('should handle different years correctly', () => {
		const testDate1 = new Date('2023-12-31T12:00:00Z');
		const testDate2 = new Date('2025-01-01T12:00:00Z');

		expect(formatDate(testDate1)).toBe('2023-12-31');
		expect(formatDate(testDate2)).toBe('2025-01-01');
	});

	it('should use current date when no date is provided', () => {
		const formatted = formatDate();
		// Should be a valid date string in YYYY-MM-DD format
		expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it('should handle leap year dates correctly', () => {
		const leapDate = new Date('2024-02-29T12:00:00Z');
		const formatted = formatDate(leapDate);
		expect(formatted).toBe('2024-02-29');
	});

	it('should format dates consistently', () => {
		// Test dates without timezone issues
		const date1 = new Date('2024-06-15T12:00:00');
		const date2 = new Date('2024-06-15T18:00:00');

		// The formatted date should match the input date
		expect(formatDate(date1)).toMatch(/2024-06-15/);
		expect(formatDate(date2)).toMatch(/2024-06-15/);
	});
});
