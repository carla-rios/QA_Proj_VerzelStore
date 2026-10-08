# Checkpoint – Projeto QA Verzel Store

Data: 08/10/2026

## Onde paramos
- **Etapa 1 do plano concluída:** leitura do PDF e da documentação da loja (`/documentacao`).
- O resumo está em `Doc/Etapa 1 - Lendo PDF.md` (já limpo: sem dicas de entrevista e sem conversa residual).
- **Nenhum arquivo de código foi alterado.** A Etapa 0 (organização) ainda não começou.

## Pendente: 3 decisões
1. **Formato dos cenários:** só Markdown, ou Markdown + `.feature`? (recomendado: os dois)
2. **Testes automatizados:** mínimo 3, recomendado 5 (1 de API).
3. **Config do Playwright:** reduzir para só chromium?

Ao voltar, responda as três ou diga "pode seguir com as recomendações".

## Estado do repositório
- Branch `main`, 1 commit (`Initial commit`).
- Não rastreados: `Doc/`, `package.json`.
- Playwright instalado (`@playwright/test ^1.64.0`).
- Testes atuais em `tests/01 - Validando acessp ao projeto.spec.ts` (TC 01 título, TC 02 banner). O nome do arquivo tem erro de digitação ("acessp").
- `playwright.config.ts` roda em chromium, firefox e webkit, sem `baseURL`.
- `package.json` sem scripts. `README.md` só tem o título.

## Próximos passos
- **Etapa 0:** criar `docs/` e `features/` (prints vão em `Evidences/`, que já existe); renomear o teste; `baseURL` + só chromium; scripts `test` e `test:report`; conferir `.gitignore`.
- **Etapa 1 (exploração):** navegar vitrine, carrinho, checkout e confirmação, anotando seletores reais.
- **Etapas 2 a 7:** cenários Gherkin, execução manual, bugs, automação, evidências, README e entrega.

## Dados importantes
- Loja: https://verzel-store.qa-test-verzel-store.workers.dev/
- Documentação: `/documentacao` (renderizada por JS; o texto está no bundle `/assets/index-*.js`).
- Formulário de envio: https://elitedev.verzel.com.br/
- Prazo: 5 dias corridos a partir do recebimento do PDF.
- Cupons: `BEMVINDO10` (10%, válido) e `VERAO2026` (15%, expirado em 31/03/2026).
- Frete: R$ 19,90 abaixo de R$ 200,00; grátis a partir de R$ 200,00, inclusive.
- Máximo de 5 unidades por produto (UI e API).
- Produtos úteis: P005 (R$ 100,00), P008 (R$ 50,00), P006 (R$ 29,90).

## Possíveis bugs (indícios, a confirmar na UI e em `/api/pedidos`)
1. **CA06:** subtotal de exatamente R$ 200,00 cobrou frete de R$ 19,90 (deveria ser grátis). `valorFaltanteFreteGratis` veio 0 com `freteGratis: false`.
   - Teste: `POST /api/carrinho/calcular` com `{"itens":[{"produtoId":"P005","quantidade":2}]}`.
2. **CA10:** `/api/carrinho/calcular` aceitou 6 unidades do P001 (esperado: 422 `QUANTIDADE_MAXIMA_EXCEDIDA`).

## Anotações
- Uso de IA: o Claude foi usado para ler o PDF, extrair a documentação, sondar a API e montar o plano. Registrar no README e no formulário.
- O arquivo `Doc/__Verificar.md` é seu rascunho; não foi alterado.
