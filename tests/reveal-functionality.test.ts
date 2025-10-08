import { test, expect, waitForApp } from './test-setup';

test.describe('Reveal Functionality', () => {
	test.beforeEach(async ({ mockPage }) => {
		await waitForApp(mockPage);
	});

	test('should show reveal button after delay', async ({ mockPage: page }) => {
		// Wait for the reveal container to appear (it has a 2 second delay)
		const revealContainer = page.getByTestId('reveal-container');
		await expect(revealContainer).toBeVisible({ timeout: 5000 });

		// The initial reveal button should be visible
		const revealButton = page.getByTestId('reveal-initial-button');
		await expect(revealButton).toBeVisible();
	});

	test('should show confirmation when reveal is clicked', async ({ mockPage: page }) => {
		// Wait for reveal button to appear
		const revealButton = page.getByTestId('reveal-initial-button');
		await revealButton.waitFor({ state: 'visible', timeout: 5000 });

		await revealButton.click();

		// Should show confirmation message
		const confirmation = page.getByTestId('reveal-confirmation');
		await expect(confirmation).toBeVisible();

		// Should show red confirm button
		const confirmButton = page.getByTestId('reveal-confirm-button');
		await expect(confirmButton).toBeVisible();
	});

	test('should reveal all answers when confirmed', async ({ mockPage: page }) => {
		// Wait for and click initial reveal button
		const revealButton = page.getByTestId('reveal-initial-button');
		await revealButton.waitFor({ state: 'visible', timeout: 5000 });
		await revealButton.click();

		// Click confirmation button
		const confirmButton = page.getByTestId('reveal-confirm-button');
		await confirmButton.waitFor({ state: 'visible' });
		await confirmButton.click();

		// Wait for challenge to be marked complete
		const completeContainer = page.getByTestId('challenge-complete');
		await expect(completeContainer).toBeVisible({ timeout: 5000 });

		// All three words should be revealed in the challenge header
		const challengeHeader = page.getByTestId('challenge-header');
		await expect(challengeHeader).toContainText('swimming');
		await expect(challengeHeader).toContainText('dogs');
		await expect(challengeHeader).toContainText('happiness');

		// No word types should be visible
		const wordTypes = await page.locator('span:has-text("(gerund)")').count();
		expect(wordTypes).toBe(0);
	});

	test('should apply reveal glow effect to image', async ({ mockPage: page }) => {
		// Wait for and click initial reveal button
		const revealButton = page.getByTestId('reveal-initial-button');
		await revealButton.waitFor({ state: 'visible', timeout: 5000 });
		await revealButton.click();

		// Click confirmation button
		const confirmButton = page.getByTestId('reveal-confirm-button');
		await confirmButton.waitFor({ state: 'visible' });
		await confirmButton.click();

		// Check that the reveal-glow class is applied
		const imageWrapper = page.locator('div.reveal-glow');
		await expect(imageWrapper).toBeVisible({ timeout: 3000 });
	});

	test('should show next dream button after reveal', async ({ mockPage: page }) => {
		// Complete the reveal process
		const revealButton = page.getByTestId('reveal-initial-button');
		await revealButton.waitFor({ state: 'visible', timeout: 5000 });
		await revealButton.click();

		const confirmButton = page.getByTestId('reveal-confirm-button');
		await confirmButton.waitFor({ state: 'visible' });
		await confirmButton.click();

		// Wait for challenge complete container
		const completeContainer = page.getByTestId('challenge-complete');
		await expect(completeContainer).toBeVisible({ timeout: 5000 });

		// Should show "Next Dream" button
		const nextButton = page.getByTestId('next-dream-button');
		await expect(nextButton).toBeVisible();
		// Should have pulse animation class
		await expect(nextButton).toHaveClass(/pulse-animation/);
	});

	test('should navigate to next level', async ({ mockPage: page }) => {
		// Complete first challenge by revealing
		const revealButton = page.getByTestId('reveal-initial-button');
		await revealButton.waitFor({ state: 'visible', timeout: 5000 });
		await revealButton.click();

		const confirmButton = page.getByTestId('reveal-confirm-button');
		await confirmButton.waitFor({ state: 'visible' });
		await confirmButton.click();

		// Click next dream button
		const nextButton = page.getByTestId('next-dream-button');
		await nextButton.waitFor({ state: 'visible', timeout: 5000 });
		await nextButton.click();

		// Should show new challenge with different words
		await page.waitForTimeout(1000); // Wait for transition

		// Check for medium challenge words (running, trees, freedom)
		const input = page.getByPlaceholder('What am I dreaming of?');
		await expect(input).toBeVisible();

		// Verify we're on a new challenge by checking hints are visible again
		const hints = page.locator('span:has-text("(gerund)")');
		await expect(hints.first()).toBeVisible();
	});
});
