import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }, testInfo) => {
	// Evidência: salva o print da tela ao final de cada teste (somente no chromium, para não repetir por navegador)
	// Teste que passou vai para Doc/04 - Evidences; teste que falhou (bug) vai para Doc/05 - Bug
	if (testInfo.project.name !== 'chromium') return;
	const pasta = testInfo.status === 'passed' ? 'Doc/04 - Evidences' : 'Doc/05 - Bug';
	const nomeArquivo = testInfo.title.replace(/[\\/:*?"<>|]/g, '');
	await page.screenshot({ path: `${pasta}/${nomeArquivo}.png`, fullPage: true });
});

test('TC 0.1 - Validar acesso ao projeto', async ({ page }) => {
	// Dado que acesso a página inicial da loja
	await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/');

	// Então o título da página deverá ser "Produtos | Verzel Store"
	await expect(page).toHaveTitle('Produtos | Verzel Store');
});

test('TC 0.2 - Validar texto principal do banner', async ({ page }) => {
	// Dado que acesso a página inicial da loja
	await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/');

	// Então o banner deverá apresentar o texto "Frete grátis a partir de R$ 200,00."
	await expect(page.getByText('Frete grátis a partir de ')).toBeVisible();
});
