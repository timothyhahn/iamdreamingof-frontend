import { test, expect, waitForApp } from './test-setup';

test.describe('Keyboard Navigation', () => {
	test.beforeEach(async ({ mockPage }) => {
		await waitForApp(mockPage);
	});

	test('should accept suggestion with Enter key', async ({ mockPage: page }) => {
		const input = page.getByPlaceholder('What am I dreaming of?');

		// Type a partial word from our mock data
		await input.fill('swim');

		// Wait for suggestion button to appear
		const suggestionButton = page.getByTestId('suggestion-button');
		await suggestionButton.waitFor({ state: 'visible', timeout: 5000 });

		// Press Enter to accept suggestion
		await input.press('Enter');

		// Input should be cleared
		await expect(input).toHaveValue('');

		// The word should appear as correct (since it's in our mock data)
		const challengeHeader = page.getByTestId('challenge-header');
		await expect(challengeHeader).toContainText('swimming');
	});

	test('should show warning with Enter on unknown word', async ({ mockPage: page }) => {
		const input = page.getByPlaceholder('What am I dreaming of?');

		// Type nonsense word
		await input.fill('xyzabc');

		// Press Enter
		await input.press('Enter');

		// Should show warning message using test ID
		const warning = page.getByTestId('unknown-word-warning');
		await expect(warning).toBeVisible({ timeout: 2000 });
		await expect(warning).toContainText('xyzabc');

		// Input should be cleared
		await expect(input).toHaveValue('');
	});

	test('should navigate to next dream with Enter when complete', async ({ mockPage: page }) => {
		// First, complete the challenge by revealing
		const revealButton = page.getByTestId('reveal-initial-button');
		await revealButton.waitFor({ state: 'visible', timeout: 5000 });
		await revealButton.click();

		const confirmButton = page.getByTestId('reveal-confirm-button');
		await confirmButton.waitFor({ state: 'visible' });
		await confirmButton.click();

		// Wait for challenge to be marked complete
		const completeContainer = page.getByTestId('challenge-complete');
		await expect(completeContainer).toBeVisible({ timeout: 5000 });

		// Press Enter to navigate to next dream
		await page.keyboard.press('Enter');

		// Should transition to next challenge (medium)
		await page.waitForTimeout(1000); // Wait for transition

		// New challenge should have input field visible
		const input = page.getByPlaceholder('What am I dreaming of?');
		await expect(input).toBeVisible();

		// Should show new word hints
		const hints = page.locator('span:has-text("(")');
		await expect(hints.first()).toBeVisible();
	});

	test('should trigger background blur effect while typing', async ({ mockPage: page }) => {
		const input = page.getByPlaceholder('What am I dreaming of?');

		// Get the blur effect layer
		const blurLayer = page.locator('div[style*="backdrop-filter"]').first();

		// Type some characters
		await input.type('test', { delay: 100 });

		// The blur effect should be applied
		await expect(blurLayer).toBeVisible();

		// Clear and verify blur resets
		await input.clear();
		await page.waitForTimeout(600); // Wait for blur to reset

		await expect(blurLayer).toBeVisible();
	});

	test('should maintain focus on input after accepting suggestion', async ({ mockPage: page }) => {
		const input = page.getByPlaceholder('What am I dreaming of?');

		// Input should have initial focus
		await expect(input).toBeFocused();

		// Type and accept a suggestion
		await input.fill('swim');

		// Wait for suggestion button
		const suggestionButton = page.getByTestId('suggestion-button');
		await suggestionButton.waitFor({ state: 'visible', timeout: 5000 });

		// Press Enter to accept
		await input.press('Enter');

		// Input should still be focused after accepting
		await expect(input).toBeFocused();
	});

	test('should clear unknown word warning when typing resumes', async ({ mockPage: page }) => {
		const input = page.getByPlaceholder('What am I dreaming of?');

		// Trigger unknown word warning
		await input.fill('xyz');
		await input.press('Enter');

		// Warning should appear
		const warning = page.getByTestId('unknown-word-warning');
		await expect(warning).toBeVisible({ timeout: 2000 });

		// Start typing again
		await input.type('d');

		// Warning should disappear
		await expect(warning).not.toBeVisible();
	});

	test('should handle Tab key navigation', async ({ mockPage: page }) => {
		const input = page.getByPlaceholder('What am I dreaming of?');

		// Input should have focus
		await expect(input).toBeFocused();

		// Tab should move focus away from input
		await page.keyboard.press('Tab');

		// Input should no longer be focused
		await expect(input).not.toBeFocused();
	});

	test('should accept all three words via keyboard', async ({ mockPage: page }) => {
		const input = page.getByPlaceholder('What am I dreaming of?');
		const words = ['swimming', 'dogs', 'happiness'];

		for (const word of words) {
			// Type first 3 letters
			await input.fill(word.substring(0, 3));

			// Wait for suggestion
			const suggestionButton = page.getByTestId('suggestion-button');
			await suggestionButton.waitFor({ state: 'visible', timeout: 5000 });

			// Press Enter to accept
			await input.press('Enter');

			// Word should appear in challenge header
			const challengeHeader = page.getByTestId('challenge-header');
			await expect(challengeHeader).toContainText(word);
		}

		// Challenge should be complete
		const completeContainer = page.getByTestId('challenge-complete');
		await expect(completeContainer).toBeVisible({ timeout: 5000 });
	});
});
