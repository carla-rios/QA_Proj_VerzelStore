import { test, expect } from '@playwright/test';

test('TC 01 - Validar acesso ao projeto', async ({ page }) => {
	await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/');

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle('Produtos | Verzel Store');
});

test('TC 02 - Validar texto principal do banner', async ({ page }) => {
	await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/');

	// Expect a title "to contain" a substring.
	await expect(page.getByText('Frete grátis a partir de ')).toBeVisible();
});