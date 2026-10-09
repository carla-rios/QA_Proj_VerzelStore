# Etapa 1 – Leitura do PDF e plano de execução

Resumo do PDF do teste técnico (`Doc/01 - PDF`) e da documentação da loja (`/documentacao`, card VZS-142, v2.3.0), com o plano de trabalho em etapas.

## Entregas pedidas no PDF

| # | Entrega | Onde está |
|---|---|---|
| 1 | Cenários de teste (Gherkin é diferencial) | `Doc/03 - Teste - Bdd/Testes - Bdd.md` |
| 2 | Execução dos testes, com o resultado de cada cenário | Tabela de resumo em `Doc/03 - Teste - Bdd/Testes - Bdd.md` |
| 3 | Report dos bugs | `Doc/05 - Bug/Bugs - Documentação.md` |
| 4 | Documento com as evidências (prints) | `Doc/04 - Evidences/` e `Doc/05 - Bug/` |
| 5 | Automação de no mínimo 3 cenários com Playwright | `tests/` |
| 6 | README: como rodar e onde achar cada entrega | `README.md` |
| 7 | Tudo em um repositório público no GitHub | https://github.com/carla-rios/QA_Proj_VerzelStore |

**Regras do PDF**
- Prazo de 5 dias corridos.
- Uso de IA permitido, informando onde e como foi usada no formulário de envio.
- Testes de carga, estresse e segurança estão fora do escopo.
- Se algo na documentação for ambíguo, registrar a interpretação e seguir em frente.

## Critérios de aceite

| CA | Regra |
|---|---|
| CA01 | O cupom BEMVINDO10 dá 10% sobre o subtotal. |
| CA02 | O código do cupom ignora maiúsculas e minúsculas e espaços nas pontas. |
| CA03 | Cupom inexistente mostra "Cupom inválido." e não dá desconto. |
| CA04 | Cupom expirado mostra "Cupom expirado." e não dá desconto. O VERAO2026 expirou em 31/03/2026. |
| CA05 | Só um cupom por vez; para trocar, remove o atual e aplica outro. |
| CA06 | Frete grátis a partir de R$ 200,00, inclusive. |
| CA07 | Abaixo disso o frete é R$ 19,90, e o carrinho mostra quanto falta. |
| CA08 | O frete grátis considera o subtotal antes do cupom. |
| CA09 | O desconto não incide sobre o frete. |
| CA10 | Máximo de 5 unidades por produto, na interface e na API. |
| CA11 | Valores arredondados para 2 casas. |

Fórmula: **total = subtotal - desconto + frete**.

## Regras que já existiam antes da entrega
- O nome do cliente precisa de nome e sobrenome.
- O e-mail precisa ter formato válido.
- O CEP precisa de 8 dígitos, com ou sem hífen.
- O pagamento é na entrega.

## API
- `GET /api/produtos` e `GET /api/produtos/{id}`.
- `POST /api/carrinho/calcular`: cupom ruim devolve 200 sem desconto, com o motivo em `cupom.mensagem`.
- `POST /api/pedidos`: cupom ruim devolve 422.
- Há 13 linhas na tabela de erros documentados (400, 404, 405 e 422).

## Não é bug (seção "Sobre este ambiente")
- O carrinho vive só na aba, usando sessionStorage.
- Os pedidos não são salvos.
- Não existe e-mail, cobrança ou estoque.
- Login, cadastro, pagamento online e consulta de pedidos estão fora do escopo.

## Produtos úteis para testar
- P005 Mochila Urbana 20L (R$ 100,00) e P008 Garrafa Térmica (R$ 50,00) dão subtotais redondos, bons para o limite de R$ 200,00.
- P006 Kit 3 Pares de Meias (R$ 29,90) serve para arredondamento.
- P003 Tênis Casual Urbano (R$ 189,90) + P006 dão R$ 219,80: acima de R$ 200,00 antes do cupom e abaixo depois dele (CA08).

## Bugs encontrados
Os dois indícios encontrados na leitura da API foram confirmados e documentados em `Doc/05 - Bug/Bugs - Documentação.md`:
- **BUG-01 (CA06):** subtotal de exatamente R$ 200,00 cobra frete de R$ 19,90. Confirmado na interface (carrinho e checkout) e na API (`/calcular` e `/pedidos`).
- **BUG-02 (CA10):** a API aceita 6 unidades do mesmo produto (`/calcular` responde 200 e `/pedidos` responde 201). Pela interface o limite de 5 funciona.

---

# Plano passo a passo

| Etapa | Descrição | Situação |
|---|---|---|
| 0 | Organização | ✅ Concluída (com pendências opcionais) |
| 1 | Explorar a loja | ✅ Concluída |
| 2 | Cenários em Gherkin | ✅ Concluída |
| 3 | Report de bugs | ✅ Concluída |
| 4 | Automação com Playwright | ✅ Concluída |
| 5 | Evidências | ✅ Concluída |
| 6 | README e entrega | 🔄 README pronto; falta o envio do formulário |

## Etapa 0 – Organização
- ✅ Criar as pastas `Doc/` (01 a 05) e `tests/`.
- ✅ Renomear o arquivo de teste com erro de digitação ("acessp"), hoje `00 - Validar Funcionamento PW.spec.ts`.
- ✅ Conferir se o `.gitignore` cobre `node_modules`, `playwright-report` e `test-results`.
- ⬜ Opcional: colocar o `baseURL` no `playwright.config.ts` e trocar a URL completa por `page.goto('/')`.
- ⬜ Opcional: deixar só o Chromium no `playwright.config.ts` (hoje roda em Chromium, Firefox e WebKit).
- ⬜ Opcional: adicionar os scripts `test` e `test:report` no `package.json`.

## Etapa 1 – Explorar a loja
- Navegar pelo fluxo: vitrine, carrinho e checkout.
- Mapear os elementos de cada tela (botões, campos, mensagens e o Resumo do pedido) para servir de base aos cenários e à automação.

## Etapa 2 – Cenários em Gherkin
- Escritos em português, com Dado/Quando/Então, em `Doc/03 - Teste - Bdd/Testes - Bdd.md`.
- Um cenário por critério de aceite (CA01 a CA11), mais os testes de fumaça (TC 0.x) e da tela Produtos (TC 1.x).
- Cada cenário tem um ID (`TC x.x`), o mesmo usado no título do teste automatizado.
- Não foram criados arquivos `.feature` separados: o Gherkin fica dentro do Markdown.

## Etapa 3 – Report de bugs
- Modelo: título, passos, resultado esperado, resultado obtido, severidade, prioridade, evidência e critério violado (CA).
- Documento: `Doc/05 - Bug/Bugs - Documentação.md` (BUG-01 e BUG-02).

## Etapa 4 – Automação com Playwright
- Sem Page Objects: cada teste é uma sequência de passos com comentários Dado/Quando/Então em português.
- Título no padrão `TC x.x - CAxx - Validar ...`.
- Arquivos:
  - `00 - Validar Funcionamento PW.spec.ts`: testes de fumaça (TC 0.1 e 0.2).
  - `01 - Tela Home-Produtos.spec.ts`: vitrine e carrinho básico (TC 1.1 a 1.3).
  - `02 - Tela Carrinho.spec.ts`: um teste por critério de aceite (TC 2.1 a 2.11).
- O TC 2.6 (CA06) falha de propósito, por causa do BUG-01.

## Etapa 5 – Evidências
- Os testes salvam o print sozinhos ao final de cada teste (`test.afterEach`, somente no Chromium):
  - testes que passaram → `Doc/04 - Evidences/`
  - testes que falharam (bugs) → `Doc/05 - Bug/`, junto com o documento de bugs.
- O nome de cada print é o título do teste.
- A tabela de resumo do `Testes - Bdd.md` tem o link do print de cada cenário.

## Etapa 6 – README e entrega
- ✅ README com: o que é o projeto, como instalar e rodar, estrutura de pastas, objetivo de cada documento e de cada teste, e a seção "Uso de IA".
- ⬜ Fazer o push para o repositório público.
- ⬜ Enviar o link pelo formulário: https://elitedev.verzel.com.br/

---

# Estrutura atual

```
QA_Proj_VerzelStore/
├── Doc/
│   ├── 01 - PDF/
│   │   └── _Teste tecnico QA Junior - Verzel.pdf   ← enunciado do teste técnico
│   ├── 02 - Plano de execução/
│   │   └── Etapa 1 - Lendo PDF.md                  ← este documento
│   ├── 03 - Teste - Bdd/
│   │   └── Testes - Bdd.md                         ← cenários em Gherkin e resultado
│   ├── 04 - Evidences/
│   │   └── *.png                                   ← prints dos testes que passaram
│   └── 05 - Bug/
│       ├── Bugs - Documentação.md                  ← report dos bugs
│       └── *.png                                   ← prints dos testes que falharam
├── tests/
│   ├── 00 - Validar Funcionamento PW.spec.ts
│   ├── 01 - Tela Home-Produtos.spec.ts
│   └── 02 - Tela Carrinho.spec.ts
├── playwright.config.ts
├── package.json
└── README.md
```
