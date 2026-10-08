import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	// Pré requisito - Ter item(s) no carrinho.

	//Para ter itens no carrinho, visito a home, adiciono, visito carrinho e item deve existir;
	
	await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/');
	await page.getByText('Adicionar ao carrinho').nth(4).click(); 
	await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/carrinho');
	await expect(page.getByText('Mochila Urbana 20L')).toBeVisible();
});

test('TC 2.1 - Validar aplicação do desconto de 10% - CA01', async ({ page }) => {
	//Dado que o carrinho possui itens abaixo de R$ 200,00
	await expect(page.locator('dt:has-text("Subtotal")')).toBeVisible();
	await expect(page.locator('dd:has-text("R$ 100,00")')).toBeVisible();
	
	// E inseri o cupom de desconto no campo Cupom de desconto
	await page.locator('input#campo-cupom').fill('BEMVINDO10')

	// E clique na opção "Aplicar cupom"
	await page.getByRole('button', { name: 'Aplicar cupom' }).click(); 

	// Quando validar o valor subtotal do carrinho
	await expect(page.locator('dt:has-text("Desconto")')).toBeVisible();
	await expect(page.locator('dd:has-text("R$ 10,00")')).toBeVisible();

	// Então o frete deverá ser apresentado
	await expect(page.locator('dt:has-text("Frete")')).toBeVisible();
	await expect(page.locator('dd:has-text("R$ 19,90")')).toBeVisible();
});