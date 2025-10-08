import { test, expect, waitForApp } from './test-setup';

test.describe('Challenge Flow', () => {
	test.beforeEach(async ({ mockPage }) => {
		await waitForApp(mockPage);
	});

	test('should display challenge components', async ({ mockPage: page }) => {
		// Check that main components are visible
		await expect(page.getByPlaceholder('What am I dreaming of?')).toBeVisible();

		// Check for word type hints - we know we have exactly 3
		const hints = page.locator('span:has-text("(gerund)")');
		await expect(hints.first()).toBeVisible();

		const objectHint = page.locator('span:has-text("(object)")');
		await expect(objectHint.first()).toBeVisible();

		const conceptHint = page.locator('span:has-text("(concept)")');
		await expect(conceptHint.first()).toBeVisible();
	});

	test('should allow typing and show suggestions for known words', async ({ mockPage: page }) => {
		const input = page.getByPlaceholder('What am I dreaming of?');

		// Type a partial word that we know exists in our mock data
		await input.fill('swim'); // "swimming" is in our mock easy challenge

		// Wait for suggestion container to appear
		const suggestionContainer = page.getByTestId('suggestion-container');
		await expect(suggestionContainer).toBeVisible({ timeout: 5000 });

		// Should show a suggestion button
		const suggestionButton = page.getByTestId('suggestion-button');
		await expect(suggestionButton).toBeVisible();

		// Verify the suggestion is for "swimming"
		const suggestionText = await suggestionButton.getAttribute('data-suggestion');
		expect(suggestionText).toBe('swimming');
	});

	test('should accept correct guess for swimming', async ({ mockPage: page }) => {
		const input = page.getByPlaceholder('What am I dreaming of?');

		// Type "swim" to get suggestion for "swimming"
		await input.fill('swim');

		// Wait for suggestion button to appear
		const suggestionButton = page.getByTestId('suggestion-button');
		await suggestionButton.waitFor({ state: 'visible', timeout: 5000 });

		// Click the suggestion
		await suggestionButton.click();

		// Input should be cleared
		await expect(input).toHaveValue('');

		// Look for swimming in the challenge header specifically
		const challengeHeader = page.getByTestId('challenge-header');
		await expect(challengeHeader).toContainText('swimming');
	});

	test('should show warning for unknown words', async ({ mockPage: page }) => {
		const input = page.getByPlaceholder('What am I dreaming of?');

		// Type a word that definitely won't be in the list
		await input.fill('xyzabc123');

		// Press Enter
		await input.press('Enter');

		// Should show warning using test ID
		const warning = page.getByTestId('unknown-word-warning');
		await expect(warning).toBeVisible({ timeout: 2000 });
		await expect(warning).toContainText('xyzabc123');

		// Input should be cleared
		await expect(input).toHaveValue('');
	});

	test('should complete challenge when all words are guessed', async ({ mockPage: page }) => {
		const input = page.getByPlaceholder('What am I dreaming of?');

		// Guess all three words from our mock easy challenge
		const words = ['swimming', 'dogs', 'happiness'];

		for (const word of words) {
			// Type first few letters
			await input.fill(word.substring(0, 3));

			// Wait for and click suggestion
			const suggestionButton = page.getByTestId('suggestion-button');
			const hasSuggestion = await suggestionButton
				.waitFor({
					state: 'visible',
					timeout: 2000
				})
				.then(() => true)
				.catch(() => false);

			if (hasSuggestion) {
				await suggestionButton.click();
				await page.waitForTimeout(500); // Wait for animation
			}
		}

		// Challenge should be complete
		const completeContainer = page.getByTestId('challenge-complete');
		await expect(completeContainer).toBeVisible({ timeout: 5000 });

		// Should show next dream button
		const nextButton = page.getByTestId('next-dream-button');
		await expect(nextButton).toBeVisible();
	});

	test('should handle case-insensitive input', async ({ mockPage: page }) => {
		const input = page.getByPlaceholder('What am I dreaming of?');

		// Type uppercase for a known word
		await input.fill('SWIM');

		// Wait for suggestion container
		const suggestionContainer = page.getByTestId('suggestion-container');
		await expect(suggestionContainer).toBeVisible({ timeout: 5000 });

		// Check suggestion button
		const suggestionButton = page.getByTestId('suggestion-button');
		await expect(suggestionButton).toBeVisible();

		// Verify suggestion is still lowercase
		const suggestionText = await suggestionButton.getAttribute('data-suggestion');
		expect(suggestionText).toBe('swimming');
	});

	test('should handle incorrect guesses', async ({ mockPage: page }) => {
		const input = page.getByPlaceholder('What am I dreaming of?');

		// Type a word that exists but isn't in the current challenge
		// "running" exists in the word list but not in easy challenge (it's in medium)
		await input.fill('run');

		// Wait for and click suggestion
		const suggestionButton = page.getByTestId('suggestion-button');
		await suggestionButton.waitFor({ state: 'visible', timeout: 5000 });
		await suggestionButton.click();

		// Should show incorrect message
		const incorrectMessage = page.getByText(/I don't think I was dreaming of/);
		await expect(incorrectMessage).toBeVisible({ timeout: 2000 });
		await expect(incorrectMessage).toContainText('running');
	});
});
