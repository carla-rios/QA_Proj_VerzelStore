import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }, testInfo) => {
	// Evidência: salva o print da tela ao final de cada teste (somente no chromium, para não repetir por navegador)
	// Teste que passou vai para Doc/Evidences; teste que falhou (bug) vai para Doc/Bug
	if (testInfo.project.name !== 'chromium') return;
	const pasta = testInfo.status === 'passed' ? 'Doc/Evidences' : 'Doc/Bug';
	const nomeArquivo = testInfo.title.replace(/[\\/:*?"<>|]/g, '');
	await page.screenshot({ path: `${pasta}/${nomeArquivo}.png`, fullPage: true });
});

test.beforeEach(async ({ page }) => {
	await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/');
});

test('TC 1.1 - Validar adição de produto ao carrinho', async ({ page }) => {
    // Dado que um produto foi adicionado ao carrinho
    await page.getByText('Adicionar ao carrinho').nth(4).click(); 
    
    // Quando validar a apresentação do item na tela carrinho
    await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/carrinho');

    // Então o produto escolhido deverá ser o selecionado anteriormente
	await expect(page.getByText('Mochila Urbana 20L')).toBeVisible();
});

test('TC 1.2 - Validar opção "Esvaziar carrinho"', async ({ page }) => {
    // Dado que adicionei um produto no carrinho
	await page.getByText('Adicionar ao carrinho').nth(4).click(); 
    
	// E estou visualizando a tela de carrinho
    await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/carrinho');
    
    // Quando realizar um clique na opção "Esvaziar carrinho"
    await page.getByText('Esvaziar carrinho').click();

    // Então o sistema deverá apresentar o título "Seu carrinho está vazio"
    await expect(page.getByText('Seu carrinho está vazio')).toBeVisible();

	// E deverá apresentar o sub-título "Escolha um produto na vitrine para começar."
    await expect(page.getByText('Escolha um produto na vitrine para começar.')).toBeVisible();

	// E o botão "Ver produtos"
    await expect(page.getByRole('link', { name: 'Ver produtos' })).toBeVisible();
});

test('TC 1.3 - Validar retornar a tela Produtos após excluir itens do carrinho', async ({ page }) => {
    // Dado que adicionei um produto no carrinho
	await page.getByText('Adicionar ao carrinho').nth(4).click(); 
    
	// E estou visualizando a tela de carrinho
    await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/carrinho');
    
    // E ao realizar um clique na opção "Esvaziar carrinho"
    await page.getByText('Esvaziar carrinho').click();

	// Quando fizer um click no botão "Ver produtos"
    await page.getByRole('link', { name: 'Ver produtos' }).click();

    // Então o sistema deverá redirecionar para tela Home-Produtos
    await expect(page.getByText('Frete grátis a partir de ')).toBeVisible();
    await expect(page).toHaveTitle('Produtos | Verzel Store');
});
