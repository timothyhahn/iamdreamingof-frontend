import { test as base, type Page } from '@playwright/test';
import { mockDreamsForDay } from './fixtures/mockChallenges';

export const test = base.extend<{
	mockPage: Page;
}>({
	mockPage: async ({ page }, use) => {
		// Mock the API calls
		await page.route('**/cdn.iamdreamingof.com/**', async (route) => {
			// Return mock data for all API calls
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(mockDreamsForDay)
			});
		});

		// Mock image loading
		await page.route('**/*.jpg', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'image/jpeg',
				// 1x1 transparent pixel
				body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')
			});
		});

		await page.route('**/*.webp', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'image/webp',
				body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')
			});
		});

		// Skip the help modal by setting localStorage
		await page.addInitScript(() => {
			localStorage.setItem('hasSeenHelp', 'true');
		});

		await use(page);
	}
});

export { expect } from '@playwright/test';

/**
 * Wait for app to be ready without modal
 */
export async function waitForApp(page: Page) {
	await page.goto('/');

	// Wait for the input to be visible
	const input = page.getByPlaceholder('What am I dreaming of?');
	await input.waitFor({ state: 'visible', timeout: 10000 });

	// Ensure images are loaded
	await page.waitForTimeout(500);

	return input;
}
