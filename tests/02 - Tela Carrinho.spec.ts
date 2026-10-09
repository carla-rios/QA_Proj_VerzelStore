import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }, testInfo) => {
	// Evidência: salva o print da tela ao final de cada teste (somente no chromium, para não repetir por navegador)
	// Teste que passou vai para Doc/04 - Evidences; teste que falhou (bug) vai para Doc/05 - Bug
	if (testInfo.project.name !== 'chromium') return;
	const pasta = testInfo.status === 'passed' ? 'Doc/04 - Evidences' : 'Doc/05 - Bug';
	const nomeArquivo = testInfo.title.replace(/[\\/:*?"<>|]/g, '');
	await page.screenshot({ path: `${pasta}/${nomeArquivo}.png`, fullPage: true });
});

test.beforeEach(async ({ page }) => {
	// Pré requisito - Ter item(s) no carrinho.

	//Para ter itens no carrinho, visito a home, adiciono, visito carrinho e item deve existir;
	
	await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/');
	await page.getByText('Adicionar ao carrinho').nth(4).click(); 
	await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/carrinho');
	await expect(page.getByText('Mochila Urbana 20L')).toBeVisible();
});

test('TC 2.1 - CA01 - Validar aplicação do desconto de 10%', async ({ page }) => {
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


// Observação: no Resumo do pedido, cada valor (dd) tem o atributo data-valor (subtotal, desconto,
// frete e total). O seletor 'dd[data-valor="total"]' confere o valor exato de cada linha.

test('TC 2.2 - CA02 - Validar cupom com letras minúsculas e espaços nas pontas', async ({ page }) => {
	// Dado que o carrinho possui a Mochila Urbana 20L (R$ 100,00)
	await expect(page.locator('dd[data-valor="subtotal"]')).toHaveText('R$ 100,00');

	// E inseri o cupom em minúsculas e com espaços no início e no fim
	await page.getByRole('textbox', { name: 'Cupom de desconto' }).fill('  bemvindo10  ');

	// Quando clicar na opção "Aplicar cupom"
	await page.getByRole('button', { name: 'Aplicar cupom' }).click();

	// Então o cupom deverá ser aceito como BEMVINDO10
	await expect(page.getByText('Cupom BEMVINDO10 aplicado.')).toBeVisible();

	// E o desconto de 10% (R$ 10,00) deverá ser aplicado
	await expect(page.locator('dd[data-valor="desconto"]')).toHaveText('- R$ 10,00');
});

test('TC 2.3 - CA03 - Validar mensagem de cupom inexistente', async ({ page }) => {
	// Dado que inseri um cupom que não existe no campo Cupom de desconto
	await page.getByRole('textbox', { name: 'Cupom de desconto' }).fill('XPTO');

	// Quando clicar na opção "Aplicar cupom"
	await page.getByRole('button', { name: 'Aplicar cupom' }).click();

	// Então o sistema deverá apresentar a mensagem "Cupom inválido."
	await expect(page.getByRole('alert')).toHaveText('Cupom inválido.');

	// E nenhum desconto deverá ser aplicado
	await expect(page.locator('dd[data-valor="desconto"]')).toHaveText('R$ 0,00');
	await expect(page.locator('dd[data-valor="total"]')).toHaveText('R$ 119,90');
});

test('TC 2.4 - CA04 - Validar mensagem de cupom expirado', async ({ page }) => {
	// Dado que inseri o cupom VERAO2026, que expirou em 31/03/2026
	await page.getByRole('textbox', { name: 'Cupom de desconto' }).fill('VERAO2026');

	// Quando clicar na opção "Aplicar cupom"
	await page.getByRole('button', { name: 'Aplicar cupom' }).click();

	// Então o sistema deverá apresentar a mensagem "Cupom expirado."
	await expect(page.getByRole('alert')).toHaveText('Cupom expirado.');

	// E nenhum desconto deverá ser aplicado
	await expect(page.locator('dd[data-valor="desconto"]')).toHaveText('R$ 0,00');
	await expect(page.locator('dd[data-valor="total"]')).toHaveText('R$ 119,90');
});

test('TC 2.5 - CA05 - Validar que apenas um cupom pode ser aplicado por vez', async ({ page }) => {
	// Dado que apliquei o cupom BEMVINDO10
	await page.getByRole('textbox', { name: 'Cupom de desconto' }).fill('BEMVINDO10');
	await page.getByRole('button', { name: 'Aplicar cupom' }).click();
	await expect(page.getByText('Cupom BEMVINDO10 aplicado.')).toBeVisible();

	// Então o campo de cupom não deverá estar disponível para outro cupom
	await expect(page.getByRole('textbox', { name: 'Cupom de desconto' })).toBeHidden();

	// Quando clicar na opção "Remover cupom"
	await page.getByRole('button', { name: 'Remover cupom' }).click();

	// Então o desconto deverá ser removido
	await expect(page.locator('dd[data-valor="desconto"]')).toHaveText('R$ 0,00');

	// E o campo de cupom deverá voltar a ficar disponível para aplicar outro cupom
	await expect(page.getByRole('textbox', { name: 'Cupom de desconto' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Aplicar cupom' })).toBeVisible();
});

// ATENÇÃO: este teste FALHA de propósito, por causa de um bug real.
// Com subtotal de exatamente R$ 200,00 a loja cobra frete de R$ 19,90 e mostra
// "Faltam R$ 0,00 para o frete grátis.". O bug está descrito em Doc/05 - Bug/Bugs - Documentação.md (BUG-01).
test('TC 2.6 - CA06 - Validar frete grátis com subtotal de exatamente R$ 200,00', async ({ page }) => {
	// Dado que aumentei a quantidade da Mochila Urbana 20L para 2 unidades
	await page.getByRole('button', { name: 'Aumentar quantidade de Mochila Urbana 20L' }).click();

	// Quando o subtotal do carrinho for exatamente R$ 200,00
	await expect(page.locator('dd[data-valor="subtotal"]')).toHaveText('R$ 200,00');

	// Então o frete deverá ser grátis
	await expect(page.locator('dd[data-valor="frete"]')).toHaveText('Grátis');

	// E o total deverá ser R$ 200,00
	await expect(page.locator('dd[data-valor="total"]')).toHaveText('R$ 200,00');
});

test('TC 2.7 - CA07 - Validar frete de R$ 19,90 e valor que falta para o frete grátis', async ({ page }) => {
	// Dado que o carrinho possui subtotal de R$ 100,00, abaixo de R$ 200,00
	await expect(page.locator('dd[data-valor="subtotal"]')).toHaveText('R$ 100,00');

	// Quando validar o Resumo do pedido
	// Então o frete deverá ser de R$ 19,90
	await expect(page.locator('dd[data-valor="frete"]')).toHaveText('R$ 19,90');

	// E o carrinho deverá informar quanto falta para o frete grátis
	await expect(page.getByText('Faltam R$ 100,00 para o frete grátis.')).toBeVisible();
});

test('TC 2.8 - CA08 - Validar que o frete grátis considera o subtotal antes do cupom', async ({ page }) => {
	// Dado que troquei a Mochila pelo Tênis Casual Urbano (R$ 189,90) e o Kit 3 Pares de Meias (R$ 29,90)
	await page.getByRole('button', { name: 'Esvaziar carrinho' }).click();
	await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/');
	await page.getByRole('article', { name: 'Tênis Casual Urbano' }).getByRole('button', { name: 'Adicionar ao carrinho' }).click();
	await page.getByRole('article', { name: 'Kit 3 Pares de Meias' }).getByRole('button', { name: 'Adicionar ao carrinho' }).click();
	await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/carrinho');

	// E o subtotal é R$ 219,80, acima de R$ 200,00
	await expect(page.locator('dd[data-valor="subtotal"]')).toHaveText('R$ 219,80');

	// Quando aplicar o cupom BEMVINDO10, que deixa os produtos em R$ 197,82 (abaixo de R$ 200,00)
	await page.getByRole('textbox', { name: 'Cupom de desconto' }).fill('BEMVINDO10');
	await page.getByRole('button', { name: 'Aplicar cupom' }).click();
	await expect(page.locator('dd[data-valor="desconto"]')).toHaveText('- R$ 21,98');

	// Então o frete deverá continuar grátis, pois vale o subtotal antes do desconto
	await expect(page.locator('dd[data-valor="frete"]')).toHaveText('Grátis');
	await expect(page.locator('dd[data-valor="total"]')).toHaveText('R$ 197,82');
});

test('TC 2.9 - CA09 - Validar que o desconto do cupom não incide sobre o frete', async ({ page }) => {
	// Dado que o carrinho possui subtotal de R$ 100,00 e frete de R$ 19,90
	await expect(page.locator('dd[data-valor="frete"]')).toHaveText('R$ 19,90');

	// Quando aplicar o cupom BEMVINDO10
	await page.getByRole('textbox', { name: 'Cupom de desconto' }).fill('BEMVINDO10');
	await page.getByRole('button', { name: 'Aplicar cupom' }).click();

	// Então o desconto deverá ser de 10% apenas sobre os produtos (R$ 10,00)
	await expect(page.locator('dd[data-valor="desconto"]')).toHaveText('- R$ 10,00');

	// E o frete deverá continuar R$ 19,90
	await expect(page.locator('dd[data-valor="frete"]')).toHaveText('R$ 19,90');

	// E o total deverá ser R$ 100,00 - R$ 10,00 + R$ 19,90 = R$ 109,90
	await expect(page.locator('dd[data-valor="total"]')).toHaveText('R$ 109,90');
});

test('TC 2.10 - CA10 - Validar limite máximo de 5 unidades por produto', async ({ page }) => {
	// Dado que estou no carrinho com 1 unidade da Mochila Urbana 20L
	const botaoAumentar = page.getByRole('button', { name: 'Aumentar quantidade de Mochila Urbana 20L' });

	// Quando aumentar a quantidade até 5 unidades
	for (let i = 0; i < 4; i++) {
		await botaoAumentar.click();
	}

	// Então a quantidade deverá ser 5
	await expect(page.getByRole('status', { name: 'Quantidade de Mochila Urbana 20L' })).toHaveText('5');

	// E o botão de aumentar deverá ficar desabilitado
	await expect(botaoAumentar).toBeDisabled();

	// E o sistema deverá apresentar a mensagem de limite
	await expect(page.getByText('Limite de 5 unidades por produto.')).toBeVisible();
});

test('TC 2.11 - CA11 - Validar arredondamento dos valores para 2 casas decimais', async ({ page }) => {
	// Dado que adicionei o Kit 3 Pares de Meias (R$ 29,90) junto com a Mochila (R$ 100,00)
	await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/');
	await page.getByRole('article', { name: 'Kit 3 Pares de Meias' }).getByRole('button', { name: 'Adicionar ao carrinho' }).click();
	await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/carrinho');
	await expect(page.locator('dd[data-valor="subtotal"]')).toHaveText('R$ 129,90');

	// Quando aplicar o cupom BEMVINDO10
	await page.getByRole('textbox', { name: 'Cupom de desconto' }).fill('BEMVINDO10');
	await page.getByRole('button', { name: 'Aplicar cupom' }).click();

	// Então o desconto deverá ter 2 casas decimais (10% de R$ 129,90 = R$ 12,99)
	await expect(page.locator('dd[data-valor="desconto"]')).toHaveText('- R$ 12,99');

	// E o total deverá ser R$ 129,90 - R$ 12,99 + R$ 19,90 = R$ 136,81
	await expect(page.locator('dd[data-valor="total"]')).toHaveText('R$ 136,81');
});
