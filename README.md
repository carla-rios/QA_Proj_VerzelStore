# QA_Proj_VerzelStore

Projeto de **teste técnico para a vaga de QA Júnior na Verzel**.

A Verzel Store é uma loja fictícia que recebeu uma nova entrega: **cupom de desconto e frete grátis** (card VZS-142, v2.3.0). O desafio é validar essa entrega como em um time de desenvolvimento: levantar os cenários de teste, executar, reportar os bugs, guardar as evidências e automatizar os cenários com Playwright.

## Autora

**Carla Rios**

- LinkedIn: https://www.linkedin.com/in/carla-rios07
- GitHub: https://github.com/carla-rios
- Repositório do projeto: https://github.com/carla-rios/QA_Proj_VerzelStore

## Sistema testado

| Item | Link |
|---|---|
| Loja | https://verzel-store.qa-test-verzel-store.workers.dev/ |
| Documentação da entrega | https://verzel-store.qa-test-verzel-store.workers.dev/documentacao |
| API | https://verzel-store.qa-test-verzel-store.workers.dev/api |

---

## Objetivo do projeto

Validar a entrega de cupom de desconto e frete grátis da Verzel Store contra os 11 critérios de aceite (CA01 a CA11) da documentação:

- **Cupom (CA01 a CA05):** o `BEMVINDO10` dá 10% de desconto. O código ignora maiúsculas, minúsculas e espaços nas pontas. Cupom inexistente ou expirado mostra uma mensagem e não dá desconto. Só um cupom por vez.
- **Frete (CA06 a CA09):** o frete é grátis a partir de R$ 200,00 (inclusive); abaixo disso custa R$ 19,90. Vale o subtotal antes do cupom, e o desconto não incide sobre o frete.
- **Quantidade e valores (CA10 e CA11):** no máximo 5 unidades por produto, e os valores são arredondados para 2 casas decimais.

O resultado esperado do projeto é:
1. Cenários de teste escritos em BDD (Gherkin).
2. Execução dos testes, com o resultado de cada cenário.
3. Report dos bugs encontrados.
4. Evidências (prints) da execução.
5. Automação dos cenários com Playwright.

---

## Como rodar

### Pré-requisitos
- [Node.js](https://nodejs.org/) 20 ou superior (testado com a v21.5.0)
- [Git](https://git-scm.com/)

### 1. Clonar o projeto
```bash
git clone https://github.com/carla-rios/QA_Proj_VerzelStore
cd QA_Proj_VerzelStore
```

### 2. Instalar e abrir o Playwright
```bash
# 1. Instala as dependências do projeto (Playwright)
npm install

# 2. Instala os navegadores usados pelo Playwright
npx playwright install

# 3. Abre a interface do Playwright (UI Mode) para rodar e acompanhar os testes
npx playwright test --ui
```

### Outros comandos úteis
| Comando | O que faz |
|---|---|
| `npx playwright test` | Roda todos os testes sem abrir a interface |
| `npx playwright test --project=chromium` | Roda os testes somente no Chromium |
| `npx playwright show-report` | Abre o relatório HTML da última execução |

> **Atenção:** o teste **TC 2.6 (CA06) falha de propósito**, porque existe um bug real na loja. Ele está documentado como BUG-01 em `Doc/05 - Bug/Bugs - Documentação.md`.

---

## Estrutura do projeto

```
QA_Proj_VerzelStore/
├── Doc/
│   ├── 01 - PDF/
│   │   └── _Teste tecnico QA Junior - Verzel.pdf
│   ├── 02 - Plano de execução/
│   │   └── Etapa 1 - Lendo PDF.md
│   ├── 03 - Teste - Bdd/
│   │   └── Testes - Bdd.md
│   ├── 04 - Evidences/
│   │   └── *.png                        ← prints dos testes que passaram
│   └── 05 - Bug/
│       ├── Bugs - Documentação.md
│       └── *.png                        ← prints dos testes que falharam (bugs)
├── tests/
│   ├── 00 - Validar Funcionamento PW.spec.ts
│   ├── 01 - Tela Home-Produtos.spec.ts
│   └── 02 - Tela Carrinho.spec.ts
├── playwright.config.ts                 ← configuração do Playwright
├── package.json                         ← dependências do projeto
└── README.md
```

---

## Documentos da pasta `Doc/`

| Pasta | Documento | Objetivo |
|---|---|---|
| `01 - PDF` | `_Teste tecnico QA Junior - Verzel.pdf` | Enunciado original do teste técnico: o que entregar, regras, prazo e como enviar. |
| `02 - Plano de execução` | `Etapa 1 - Lendo PDF.md` | Resumo do PDF e da documentação da loja (critérios de aceite, API, o que não é bug) e o plano de trabalho em etapas. |
| `03 - Teste - Bdd` | `Testes - Bdd.md` | Todos os cenários de teste em Gherkin (Dado/Quando/Então), com uma tabela de resumo: TC, CA, resultado e link para o print de cada teste. |
| `04 - Evidences` | `*.png` | Prints dos testes que **passaram**, gerados automaticamente ao final de cada teste. O nome do arquivo é o título do teste. |
| `05 - Bug` | `Bugs - Documentação.md` e `*.png` | Report dos bugs encontrados (passos, resultado esperado e obtido, severidade, evidências) e os prints dos testes que **falharam**. |

### Entregas do teste técnico → onde encontrar

| Entrega pedida no PDF | Onde está |
|---|---|
| Cenários de teste (Gherkin) | `Doc/03 - Teste - Bdd/Testes - Bdd.md` |
| Resultado de cada cenário | Tabela de resumo em `Doc/03 - Teste - Bdd/Testes - Bdd.md` |
| Report dos bugs | `Doc/05 - Bug/Bugs - Documentação.md` |
| Evidências da execução | `Doc/04 - Evidences/` e `Doc/05 - Bug/` |
| Automação com Playwright | `tests/` |
| README | este arquivo |

### Bugs encontrados

| ID | Bug | CA |
|---|---|---|
| BUG-01 | Subtotal de exatamente R$ 200,00 cobra frete de R$ 19,90 (deveria ser grátis) | CA06 |
| BUG-02 | A API aceita mais de 5 unidades do mesmo produto (deveria responder 422) | CA10 |

---

## Testes automatizados (`tests/`)

Os testes seguem um padrão simples, sem Page Objects. Cada teste é uma sequência de passos com comentários em português no formato **Dado / Quando / Então**. O título segue o padrão `TC x.x - CAxx - Validar ...`.

Ao final de cada teste, um `test.afterEach` salva o print da tela (somente no Chromium):
- teste que passou → `Doc/04 - Evidences/`
- teste que falhou → `Doc/05 - Bug/`

| Arquivo | Objetivo | Testes |
|---|---|---|
| `00 - Validar Funcionamento PW.spec.ts` | Testes de fumaça: confirmar que o Playwright está funcionando e que a loja está no ar. | TC 0.1 título da página; TC 0.2 banner de frete grátis |
| `01 - Tela Home-Produtos.spec.ts` | Validar a vitrine de produtos e o fluxo básico do carrinho: adicionar produto, esvaziar o carrinho e voltar para a vitrine. | TC 1.1 a TC 1.3 |
| `02 - Tela Carrinho.spec.ts` | Validar a entrega de cupom e frete grátis: um teste para cada critério de aceite, de CA01 a CA11. | TC 2.1 a TC 2.11 |

**Resultado da última execução (Chromium):** 16 testes, 15 passaram e 1 falhou (TC 2.6, por causa do BUG-01).

---

## Uso de IA

O teste técnico permite o uso de IA, desde que seja informado onde e como foi usada. Usei o **Claude (Anthropic)**, pelo Claude Code no VS Code, como IA de apoio.

### O que eu fiz manualmente
- Instalei e configurei o Playwright no projeto.
- Criei manualmente o `00 - Validar Funcionamento PW.spec.ts` e o `01 - Tela Home-Produtos.spec.ts`. Esses testes também serviram de modelo para mostrar ao Claude o padrão de escrita que eu queria: título `TC x.x`, comentários Dado/Quando/Então em português e sem Page Objects.
- Criei o `beforeEach` e o primeiro teste do `02 - Tela Carrinho.spec.ts` (TC 2.1 – CA01).
- Organizei as pastas da documentação e revisei o que foi gerado.

### Onde usei o Claude
1. **Leitura e planejamento:** ler o PDF e a documentação da loja, resumir os critérios de aceite e montar o plano de execução em etapas.
2. **Mapeamento dos elementos da tela:** o Claude rodou scripts com o próprio Playwright que leem a estrutura de acessibilidade da página (*aria snapshot*). Assim ele mapeou os elementos do carrinho, do cupom, do resumo do pedido e do checkout, com os nomes e os textos reais. Também consultou a API (`/api/carrinho/calcular` e `/api/pedidos`) para confirmar os valores calculados.
3. **Criação dos testes de CA:** a partir do meu modelo, o Claude escreveu os testes TC 2.2 a TC 2.11 do `02 - Tela Carrinho.spec.ts`, rodou cada um e ajustou os seletores até ficarem estáveis.
4. **Evidências:** criação do `test.afterEach` que salva o print de cada teste na pasta certa.
5. **Documentação:** report dos bugs (BUG-01 e BUG-02), cenários em BDD e este README, sempre revisados por mim.

Os bugs foram confirmados na interface e na API antes de serem documentados.
