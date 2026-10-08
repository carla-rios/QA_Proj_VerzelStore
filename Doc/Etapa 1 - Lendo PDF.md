#	Entrega	Onde vai ficar

- Critérios de aceite

CA01: o cupom BEMVINDO10 dá 10% sobre o subtotal.
CA02: o código do cupom ignora maiúsculas e minúsculas e espaços nas pontas.
CA03: cupom inexistente mostra "Cupom inválido." e não dá desconto.
CA04: cupom expirado mostra "Cupom expirado." e não dá desconto. O VERAO2026 expirou em 31/03/2026.
CA05: só um cupom por vez; para trocar, remove o atual e aplica outro.
CA06: frete grátis a partir de R$ 200,00, inclusive.
CA07: abaixo disso o frete é R$ 19,90, e o carrinho mostra quanto falta.
CA08: o frete grátis considera o subtotal antes do cupom.
CA09: o desconto não incide sobre o frete.
CA10: máximo de 5 unidades por produto, na interface e na API.
CA11: valores arredondados para 2 casas.
Fórmula: total = subtotal - desconto + frete.

- Já existia antes da entrega

O nome do cliente precisa de nome e sobrenome.
O e-mail precisa ter formato válido.
O CEP precisa de 8 dígitos, com ou sem hífen.
O pagamento é na entrega.
API

GET /api/produtos e GET /api/produtos/{id}.
POST /api/carrinho/calcular: cupom ruim devolve 200 sem desconto, com o motivo em cupom.mensagem.
POST /api/pedidos: cupom ruim devolve 422.
Há 13 linhas na tabela de erros documentados (400, 404, 405 e 422).
Não é bug (seção "Sobre este ambiente"):

- O carrinho vive só na aba, usando sessionStorage.
Os pedidos não são salvos.
Não existe e-mail, cobrança ou estoque.
Login, cadastro, pagamento online e consulta de pedidos estão fora do escopo.
Produtos úteis para testar

P005 (R$ 100,00) e P008 (R$ 50,00) dão subtotais redondos, bons para o limite de R$ 200,00.
P006 (R$ 29,90) serve para arredondamento.
Possíveis bugs já encontrados
Fiz poucas chamadas na API e vi dois comportamentos que parecem violar a documentação:

CA06: subtotal de exatamente R$ 200,00 cobrou frete de R$ 19,90, quando deveria ser grátis. Além disso, valorFaltanteFreteGratis veio 0 enquanto freteGratis veio false.
CA10: /calcular aceitou 6 unidades do P001. A documentação diz que a regra vale para a API, e existe o erro QUANTIDADE_MAXIMA_EXCEDIDA.
São só indícios. Falta confirmar na interface e no /api/pedidos, e documentar com evidências. O CA06 é o melhor candidato a cenário automatizado.

- Situação atual do repositório

O Playwright já está instalado e há 2 testes no arquivo tests/01 - Validando acessp ao projeto.spec.ts. O nome tem um erro de digitação ("acessp").
O playwright.config.ts roda em chromium, firefox e webkit. Para simplificar, sugiro deixar só o chromium.
O package.json não tem scripts e o README está vazio.
Plano passo a passo
Etapa 0 – Organização (30 min)

Criar as pastas docs/, docs/img/ e tests/, e renomear o arquivo de teste com o erro de digitação.
Colocar o baseURL no config, trocar page.goto('/') pelo caminho curto e deixar só o chromium.
Adicionar os scripts test e test:report no package.json.
Conferir se o .gitignore cobre node_modules, playwright-report e test-results.

# Etapa 1 – Explorar a loja (1–2 h)

Navegar pelo fluxo completo: vitrine, carrinho, checkout e confirmação.
Anotar o que cada tela mostra, para servir de base dos cenários.

# Etapa 2 – Cenários em Gherkin (2–3 h)

Escrever em português, com Dado/Quando/Então.
Criar um grupo por critério de aceite (CA01 a CA11).
Incluir o checkout, com nome, e-mail e CEP, e os erros da API.
Dar um ID a cada cenário (por exemplo CT-01) e marcar quais serão automatizados.

# Etapa 3 – Execução manual e exploratória (3–4 h)

Executar cada cenário e registrar passou/falhou numa tabela.
Tirar print de cada resultado, principalmente das falhas.
Fazer uma sessão exploratória: limites (R$ 199,99, R$ 200,00, R$ 200,01), 5 e 6 unidades, cupom com espaço e em minúsculas, e trocar de cupom.
Testar a API direto (calcular e pedidos) para comparar com a interface.

# Etapa 4 – Report de bugs (1–2 h)

Usar um modelo simples: título, passos, resultado esperado, resultado obtido, severidade, evidência e critério violado (CA).
Registrar as ambiguidades e a sua interpretação, como o PDF pede.

# Etapa 6 – Evidências (1 h)

Montar o docs/04-evidencias.md com os prints organizados por cenário e por bug.
Gerar o relatório HTML do Playwright e guardar um print dele.

# Etapa 7 – README e entrega (1 h)

Escrever o README com: o que é o projeto, requisitos, como instalar e rodar, e uma tabela "entrega → arquivo".
Incluir uma seção "Uso de IA", que ajuda a preencher o formulário.
Fazer o push para um repositório público, abrir https://elitedev.verzel.com.br/ e enviar o link.
Estrutura final

├── README.md
├── playwright.config.ts
├── package.json
├── docs/
│   ├── 01-cenarios.md
│   ├── 02-execucao.md
│   ├── 03-bugs.md
│   ├── 04-evidencias.md
│   └── img/
├── features/            ← arquivos .feature (Gherkin)
└── tests/
    ├── 01-acesso.spec.ts
    ├── 02-cupom.spec.ts
    ├── 03-frete.spec.ts
    └── 04-api.spec.ts