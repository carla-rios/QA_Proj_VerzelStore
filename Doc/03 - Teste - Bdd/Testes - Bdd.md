# Testes em BDD – Verzel Store (card VZS-142, v2.3.0)

Cenários escritos em Gherkin (português), com base na documentação da loja (`/documentacao`) e nos critérios de aceite CA01 a CA11. Todos os cenários abaixo estão automatizados com Playwright, na pasta `tests/`.

**Tags usadas**
- `@TC-x.x`: ID do teste (o mesmo do título no Playwright)
- `@CAxx`: critério de aceite validado
- `@automatizado`: cenário com teste automatizado
- `@bug`: cenário que falha por causa de um bug real (ver `05 - Bug`)

## Resumo

| TC | CA | Cenário | Arquivo | Resultado | Evidência |
|---|---|---|---|---|---|
| TC 0.1 | – | Validar acesso ao projeto | `00 - Validar Funcionamento PW.spec.ts` | ✅ Passou | [print](<../04 - Evidences/TC 0.1 - Validar acesso ao projeto.png>) |
| TC 0.2 | – | Validar texto principal do banner | `00 - Validar Funcionamento PW.spec.ts` | ✅ Passou | [print](<../04 - Evidences/TC 0.2 - Validar texto principal do banner.png>) |
| TC 1.1 | – | Validar adição de produto ao carrinho | `01 - Tela Home-Produtos.spec.ts` | ✅ Passou | [print](<../04 - Evidences/TC 1.1 - Validar adição de produto ao carrinho.png>) |
| TC 1.2 | – | Validar opção "Esvaziar carrinho" | `01 - Tela Home-Produtos.spec.ts` | ✅ Passou | [print](<../04 - Evidences/TC 1.2 - Validar opção Esvaziar carrinho.png>) |
| TC 1.3 | – | Validar retornar a tela Produtos após excluir itens do carrinho | `01 - Tela Home-Produtos.spec.ts` | ✅ Passou | [print](<../04 - Evidences/TC 1.3 - Validar retornar a tela Produtos após excluir itens do carrinho.png>) |
| TC 2.1 | CA01 | Validar aplicação do desconto de 10% | `02 - Tela Carrinho.spec.ts` | ✅ Passou | [print](<../04 - Evidences/TC 2.1 - CA01 - Validar aplicação do desconto de 10%.png>) |
| TC 2.2 | CA02 | Validar cupom com letras minúsculas e espaços nas pontas | `02 - Tela Carrinho.spec.ts` | ✅ Passou | [print](<../04 - Evidences/TC 2.2 - CA02 - Validar cupom com letras minúsculas e espaços nas pontas.png>) |
| TC 2.3 | CA03 | Validar mensagem de cupom inexistente | `02 - Tela Carrinho.spec.ts` | ✅ Passou | [print](<../04 - Evidences/TC 2.3 - CA03 - Validar mensagem de cupom inexistente.png>) |
| TC 2.4 | CA04 | Validar mensagem de cupom expirado | `02 - Tela Carrinho.spec.ts` | ✅ Passou | [print](<../04 - Evidences/TC 2.4 - CA04 - Validar mensagem de cupom expirado.png>) |
| TC 2.5 | CA05 | Validar que apenas um cupom pode ser aplicado por vez | `02 - Tela Carrinho.spec.ts` | ✅ Passou | [print](<../04 - Evidences/TC 2.5 - CA05 - Validar que apenas um cupom pode ser aplicado por vez.png>) |
| TC 2.6 | CA06 | Validar frete grátis com subtotal de exatamente R$ 200,00 | `02 - Tela Carrinho.spec.ts` | ❌ Falhou (BUG-01) | [print](<../05 - Bug/TC 2.6 - CA06 - Validar frete grátis com subtotal de exatamente R$ 200,00.png>) |
| TC 2.7 | CA07 | Validar frete de R$ 19,90 e valor que falta para o frete grátis | `02 - Tela Carrinho.spec.ts` | ✅ Passou | [print](<../04 - Evidences/TC 2.7 - CA07 - Validar frete de R$ 19,90 e valor que falta para o frete grátis.png>) |
| TC 2.8 | CA08 | Validar que o frete grátis considera o subtotal antes do cupom | `02 - Tela Carrinho.spec.ts` | ✅ Passou | [print](<../04 - Evidences/TC 2.8 - CA08 - Validar que o frete grátis considera o subtotal antes do cupom.png>) |
| TC 2.9 | CA09 | Validar que o desconto do cupom não incide sobre o frete | `02 - Tela Carrinho.spec.ts` | ✅ Passou | [print](<../04 - Evidences/TC 2.9 - CA09 - Validar que o desconto do cupom não incide sobre o frete.png>) |
| TC 2.10 | CA10 | Validar limite máximo de 5 unidades por produto | `02 - Tela Carrinho.spec.ts` | ✅ Passou | [print](<../04 - Evidences/TC 2.10 - CA10 - Validar limite máximo de 5 unidades por produto.png>) |
| TC 2.11 | CA11 | Validar arredondamento dos valores para 2 casas decimais | `02 - Tela Carrinho.spec.ts` | ✅ Passou | [print](<../04 - Evidences/TC 2.11 - CA11 - Validar arredondamento dos valores para 2 casas decimais.png>) |

**Total:** 16 cenários, 15 passaram e 1 falhou (BUG-01). Execução de 09/10/2026 no Chromium.

---

## Funcionalidade 0 – Funcionamento do Playwright (testes de fumaça)

Arquivo: `tests/00 - Validar Funcionamento PW.spec.ts`

```gherkin
# language: pt
Funcionalidade: Acesso à loja Verzel Store
  Como cliente da Verzel Store
  Quero acessar a página inicial da loja
  Para ver os produtos e a promoção de frete grátis

  @TC-0.1 @automatizado
  Cenário: TC 0.1 - Validar acesso ao projeto
    Dado que acesso a página inicial da loja
    Então o título da página deverá ser "Produtos | Verzel Store"

  @TC-0.2 @automatizado
  Cenário: TC 0.2 - Validar texto principal do banner
    Dado que acesso a página inicial da loja
    Então o banner deverá apresentar o texto "Frete grátis a partir de R$ 200,00."
```

---

## Funcionalidade 1 – Tela Home-Produtos

Arquivo: `tests/01 - Tela Home-Produtos.spec.ts`

```gherkin
# language: pt
Funcionalidade: Adicionar produtos e esvaziar o carrinho
  Como cliente da Verzel Store
  Quero adicionar produtos ao carrinho e poder esvaziá-lo
  Para montar a minha compra

  Contexto:
    Dado que estou na página inicial da loja

  @TC-1.1 @automatizado
  Cenário: TC 1.1 - Validar adição de produto ao carrinho
    Dado que um produto foi adicionado ao carrinho
    Quando validar a apresentação do item na tela carrinho
    Então o produto escolhido deverá ser o selecionado anteriormente

  @TC-1.2 @automatizado
  Cenário: TC 1.2 - Validar opção "Esvaziar carrinho"
    Dado que adicionei um produto no carrinho
    E estou visualizando a tela de carrinho
    Quando realizar um clique na opção "Esvaziar carrinho"
    Então o sistema deverá apresentar o título "Seu carrinho está vazio"
    E deverá apresentar o sub-título "Escolha um produto na vitrine para começar."
    E o botão "Ver produtos"

  @TC-1.3 @automatizado
  Cenário: TC 1.3 - Validar retornar a tela Produtos após excluir itens do carrinho
    Dado que adicionei um produto no carrinho
    E estou visualizando a tela de carrinho
    E ao realizar um clique na opção "Esvaziar carrinho"
    Quando fizer um click no botão "Ver produtos"
    Então o sistema deverá redirecionar para tela Home-Produtos
```

---

## Funcionalidade 2 – Tela Carrinho: cupom de desconto e frete grátis (CA01 a CA11)

Arquivo: `tests/02 - Tela Carrinho.spec.ts`

História (documentação da loja):
> Como cliente da Verzel Store, quero aplicar um cupom de desconto e ganhar frete grátis em compras maiores, para pagar menos nas minhas compras.

Fórmula: **total = subtotal - desconto + frete**

### Cupom de desconto (CA01 a CA05)

```gherkin
# language: pt
Funcionalidade: Cupom de desconto no carrinho
  Como cliente da Verzel Store
  Quero aplicar um cupom de desconto
  Para pagar menos nas minhas compras

  Contexto:
    Dado que adicionei a "Mochila Urbana 20L" (R$ 100,00) ao carrinho
    E estou visualizando a tela de carrinho

  @TC-2.1 @CA01 @automatizado
  Cenário: TC 2.1 - CA01 - Validar aplicação do desconto de 10%
    Dado que o carrinho possui itens abaixo de R$ 200,00
    E inseri o cupom "BEMVINDO10" no campo "Cupom de desconto"
    E clique na opção "Aplicar cupom"
    Quando validar o valor subtotal do carrinho
    Então o desconto deverá ser de "R$ 10,00"
    E o frete deverá ser apresentado com o valor "R$ 19,90"

  @TC-2.2 @CA02 @automatizado
  Cenário: TC 2.2 - CA02 - Validar cupom com letras minúsculas e espaços nas pontas
    Dado que o carrinho possui a "Mochila Urbana 20L" (R$ 100,00)
    E inseri o cupom "  bemvindo10  " em minúsculas e com espaços no início e no fim
    Quando clicar na opção "Aplicar cupom"
    Então o cupom deverá ser aceito como "BEMVINDO10"
    E o desconto de 10% ("- R$ 10,00") deverá ser aplicado

  @TC-2.3 @CA03 @automatizado
  Cenário: TC 2.3 - CA03 - Validar mensagem de cupom inexistente
    Dado que inseri o cupom "XPTO", que não existe, no campo "Cupom de desconto"
    Quando clicar na opção "Aplicar cupom"
    Então o sistema deverá apresentar a mensagem "Cupom inválido."
    E nenhum desconto deverá ser aplicado ("R$ 0,00")
    E o total deverá ser "R$ 119,90"

  @TC-2.4 @CA04 @automatizado
  Cenário: TC 2.4 - CA04 - Validar mensagem de cupom expirado
    Dado que inseri o cupom "VERAO2026", que expirou em 31/03/2026
    Quando clicar na opção "Aplicar cupom"
    Então o sistema deverá apresentar a mensagem "Cupom expirado."
    E nenhum desconto deverá ser aplicado ("R$ 0,00")
    E o total deverá ser "R$ 119,90"

  @TC-2.5 @CA05 @automatizado
  Cenário: TC 2.5 - CA05 - Validar que apenas um cupom pode ser aplicado por vez
    Dado que apliquei o cupom "BEMVINDO10"
    Então o campo de cupom não deverá estar disponível para outro cupom
    Quando clicar na opção "Remover cupom"
    Então o desconto deverá ser removido ("R$ 0,00")
    E o campo de cupom deverá voltar a ficar disponível para aplicar outro cupom
```

### Frete grátis (CA06 a CA09)

```gherkin
# language: pt
Funcionalidade: Frete grátis a partir de R$ 200,00
  Como cliente da Verzel Store
  Quero ganhar frete grátis em compras a partir de R$ 200,00
  Para pagar menos nas compras maiores

  Contexto:
    Dado que adicionei a "Mochila Urbana 20L" (R$ 100,00) ao carrinho
    E estou visualizando a tela de carrinho

  # Este cenário falha por causa de um bug real: ver BUG-01 em "05 - Bug/Bugs - Documentação.md"
  @TC-2.6 @CA06 @automatizado @bug
  Cenário: TC 2.6 - CA06 - Validar frete grátis com subtotal de exatamente R$ 200,00
    Dado que aumentei a quantidade da "Mochila Urbana 20L" para 2 unidades
    Quando o subtotal do carrinho for exatamente "R$ 200,00"
    Então o frete deverá ser "Grátis"
    E o total deverá ser "R$ 200,00"

  @TC-2.7 @CA07 @automatizado
  Cenário: TC 2.7 - CA07 - Validar frete de R$ 19,90 e valor que falta para o frete grátis
    Dado que o carrinho possui subtotal de "R$ 100,00", abaixo de R$ 200,00
    Quando validar o Resumo do pedido
    Então o frete deverá ser de "R$ 19,90"
    E o carrinho deverá informar "Faltam R$ 100,00 para o frete grátis."

  @TC-2.8 @CA08 @automatizado
  Cenário: TC 2.8 - CA08 - Validar que o frete grátis considera o subtotal antes do cupom
    Dado que troquei a Mochila pelo "Tênis Casual Urbano" (R$ 189,90) e o "Kit 3 Pares de Meias" (R$ 29,90)
    E o subtotal é "R$ 219,80", acima de R$ 200,00
    Quando aplicar o cupom "BEMVINDO10", que deixa os produtos em R$ 197,82 (abaixo de R$ 200,00)
    Então o desconto deverá ser "- R$ 21,98"
    E o frete deverá continuar "Grátis", pois vale o subtotal antes do desconto
    E o total deverá ser "R$ 197,82"

  @TC-2.9 @CA09 @automatizado
  Cenário: TC 2.9 - CA09 - Validar que o desconto do cupom não incide sobre o frete
    Dado que o carrinho possui subtotal de "R$ 100,00" e frete de "R$ 19,90"
    Quando aplicar o cupom "BEMVINDO10"
    Então o desconto deverá ser de 10% apenas sobre os produtos ("- R$ 10,00")
    E o frete deverá continuar "R$ 19,90"
    E o total deverá ser "R$ 109,90" (R$ 100,00 - R$ 10,00 + R$ 19,90)
```

### Quantidade e arredondamento (CA10 e CA11)

```gherkin
# language: pt
Funcionalidade: Limite de quantidade e arredondamento de valores
  Como cliente da Verzel Store
  Quero que a loja respeite o limite por produto e mostre valores corretos
  Para fechar a compra sem surpresas

  Contexto:
    Dado que adicionei a "Mochila Urbana 20L" (R$ 100,00) ao carrinho
    E estou visualizando a tela de carrinho

  @TC-2.10 @CA10 @automatizado
  Cenário: TC 2.10 - CA10 - Validar limite máximo de 5 unidades por produto
    Dado que estou no carrinho com 1 unidade da "Mochila Urbana 20L"
    Quando aumentar a quantidade até 5 unidades
    Então a quantidade deverá ser 5
    E o botão de aumentar deverá ficar desabilitado
    E o sistema deverá apresentar a mensagem "Limite de 5 unidades por produto."

  @TC-2.11 @CA11 @automatizado
  Cenário: TC 2.11 - CA11 - Validar arredondamento dos valores para 2 casas decimais
    Dado que adicionei o "Kit 3 Pares de Meias" (R$ 29,90) junto com a Mochila (R$ 100,00)
    E o subtotal é "R$ 129,90"
    Quando aplicar o cupom "BEMVINDO10"
    Então o desconto deverá ter 2 casas decimais ("- R$ 12,99")
    E o total deverá ser "R$ 136,81" (R$ 129,90 - R$ 12,99 + R$ 19,90)
```
