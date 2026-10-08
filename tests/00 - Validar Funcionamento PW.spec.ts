import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }, testInfo) => {
	// Evidência: salva o print da tela ao final de cada teste (somente no chromium, para não repetir por navegador)
	// Teste que passou vai para Doc/Evidences; teste que falhou (bug) vai para Doc/Bug
	if (testInfo.project.name !== 'chromium') return;
	const pasta = testInfo.status === 'passed' ? 'Doc/Evidences' : 'Doc/Bug';
	const nomeArquivo = testInfo.title.replace(/[\\/:*?"<>|]/g, '');
	await page.screenshot({ path: `${pasta}/${nomeArquivo}.png`, fullPage: true });
});

test('TC 0.1 - Validar acesso ao projeto', async ({ page }) => {
	await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/');

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle('Produtos | Verzel Store');
});

test('TC 0.2 - Validar texto principal do banner', async ({ page }) => {
	await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/');

	// Expect a title "to contain" a substring.
	await expect(page.getByText('Frete grátis a partir de ')).toBeVisible();
});
