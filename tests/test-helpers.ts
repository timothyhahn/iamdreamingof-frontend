import { type Page } from '@playwright/test';

/**
 * Helper function to close any initial modal or explanation
 */
export async function closeInitialModal(page: Page) {
	// Try multiple methods to close the modal
	const closeButton = page.getByTestId('close-modal');
	const dismissButton = page.getByTestId('dismiss-help');
	const dismissText = page.getByRole('button', { name: /dismiss this help/i });

	// Try the X close button first (with test ID)
	if (await closeButton.isVisible({ timeout: 1000 }).catch(() => false)) {
		await closeButton.click();
		await page.waitForTimeout(500); // Wait for animation
	}
	// Or try the dismiss button
	else if (await dismissButton.isVisible({ timeout: 1000 }).catch(() => false)) {
		await dismissButton.click();
		await page.waitForTimeout(500); // Wait for animation
	}
	// Or try finding by text
	else if (await dismissText.isVisible({ timeout: 1000 }).catch(() => false)) {
		await dismissText.click();
		await page.waitForTimeout(500); // Wait for animation
	}
	// Or press Escape
	else {
		const dialog = page.locator('dialog[open]');
		if (await dialog.isVisible({ timeout: 1000 }).catch(() => false)) {
			await page.keyboard.press('Escape');
			await page.waitForTimeout(500);
		}
	}
}

/**
 * Mock word lists for testing - these are words we know exist in the lists
 */
export const KNOWN_WORDS = {
	objects: ['duck', 'clouds', 'moon', 'star', 'tree', 'flower', 'bird'],
	gerunds: ['flying', 'swimming', 'running', 'jumping', 'dancing', 'singing', 'dreaming'],
	concepts: ['love', 'peace', 'joy', 'freedom', 'harmony', 'beauty', 'happiness']
};

/**
 * Get a word that's likely to be in the word list
 */
export function getTestWord(type?: 'object' | 'gerund' | 'concept'): string {
	if (type === 'object') return KNOWN_WORDS.objects[0];
	if (type === 'gerund') return KNOWN_WORDS.gerunds[0];
	if (type === 'concept') return KNOWN_WORDS.concepts[0];

	// Return a word that's likely to exist
	return 'flying';
}

/**
 * Wait for the app to be fully loaded and ready
 */
export async function waitForAppReady(page: Page) {
	// Close any initial modal
	await closeInitialModal(page);

	// Wait for the main input to be visible and ready
	const input = page.getByPlaceholder('What am I dreaming of?');
	await input.waitFor({ state: 'visible', timeout: 10000 });

	// Wait a bit more for any animations to complete
	await page.waitForTimeout(1000);

	return input;
}
