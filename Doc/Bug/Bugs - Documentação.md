# Bugs – Verzel Store (card VZS-142, v2.3.0)

## Ambiente

| Item | Valor |
|---|---|
| Loja | https://verzel-store.qa-test-verzel-store.workers.dev/ |
| API | https://verzel-store.qa-test-verzel-store.workers.dev/api |
| Versão da entrega | VZS-142 – v2.3.0 |
| Navegadores | Chromium, Firefox e WebKit (Playwright 1.64) |
| Sistema operacional | Windows 10 Pro |
| Data da execução | 08/10/2026 |

## Resumo

| ID | Título | CA violado | Severidade | Prioridade | Status |
|---|---|---|---|---|---|
| BUG-01 | Subtotal de exatamente R$ 200,00 cobra frete de R$ 19,90 | CA06 | Média | Alta | Aberto |
| BUG-02 | API aceita mais de 5 unidades do mesmo produto | CA10 | Média | Média | Aberto |

**Critério de severidade usado**
- **Alta:** impede a compra ou gera cobrança errada em qualquer pedido.
- **Média:** gera valor ou comportamento errado em uma situação específica, e a compra continua possível.
- **Baixa:** problema visual ou de texto, sem impacto em valores.

---

## BUG-01 – Subtotal de exatamente R$ 200,00 cobra frete de R$ 19,90

| Campo | Descrição |
|---|---|
| **CA violado** | CA06 – "O frete é grátis para compras com subtotal a partir de R$ 200,00, **inclusive**." |
| **Onde ocorre** | Tela Carrinho, tela Finalizar compra, `POST /api/carrinho/calcular` e `POST /api/pedidos` |
| **Severidade** | Média: o cliente paga R$ 19,90 a mais, mas só quando o subtotal é exatamente R$ 200,00 |
| **Prioridade** | Alta: afeta o valor cobrado e é a principal regra da entrega (frete grátis) |
| **Teste automatizado** | `TC 2.6 - CA06` em `tests/02 - Tela Carrinho.spec.ts` (falha de propósito, por causa deste bug) |

### Pré-condição
Carrinho vazio.

### Passos para reproduzir
1. Acessar a loja: https://verzel-store.qa-test-verzel-store.workers.dev/
2. No produto **Mochila Urbana 20L** (R$ 100,00), clicar em **Adicionar ao carrinho** 2 vezes.
3. Acessar a tela **Carrinho**.
4. Conferir o **Resumo do pedido**.
5. Clicar em **Finalizar compra** e conferir o **Resumo do pedido** novamente.

### Resultado esperado
| Subtotal | Desconto | Frete | Total |
|---|---|---|---|
| R$ 200,00 | R$ 0,00 | **Grátis** | **R$ 200,00** |

A mensagem "Faltam R$ ... para o frete grátis." não deve aparecer.

### Resultado obtido
| Subtotal | Desconto | Frete | Total |
|---|---|---|---|
| R$ 200,00 | R$ 0,00 | **R$ 19,90** | **R$ 219,90** |

- A tela mostra **"Faltam R$ 0,00 para o frete grátis."**. A própria loja indica que não falta nada, mas mesmo assim cobra o frete.
- O mesmo valor aparece na tela Finalizar compra, ou seja, o pedido seria fechado com o frete cobrado.

### Comportamento nos valores próximos do limite
| Subtotal | Frete esperado | Frete obtido | Resultado |
|---|---|---|---|
| R$ 199,80 (Calça Jeans + Camiseta) | R$ 19,90 | R$ 19,90 | OK |
| **R$ 200,00** (2x Mochila) | **Grátis** | **R$ 19,90** | **Falha** |
| R$ 219,80 (Tênis + Meias) | Grátis | Grátis | OK |

O erro acontece só no valor exato de R$ 200,00. Isso indica que a regra foi implementada como "maior que 200" e não como "maior ou igual a 200".

### Evidência na API
Requisição:
```http
POST /api/carrinho/calcular
Content-Type: application/json

{"itens":[{"produtoId":"P005","quantidade":2}]}
```

Resposta (200):
```json
{
  "subtotal": 200,
  "desconto": 0,
  "frete": 19.9,
  "freteGratis": false,
  "valorFaltanteFreteGratis": 0,
  "total": 219.9,
  "cupom": null
}
```

A resposta também é **incoerente**: `valorFaltanteFreteGratis` é `0` (não falta nada), mas `freteGratis` é `false`.

O `POST /api/pedidos` com os mesmos itens e dados válidos do cliente responde **201** e cria o pedido com `"frete": 19.9` e `"total": 219.9`.

### Evidências (prints)
- Tela Carrinho: [BUG-01-carrinho-subtotal-200-cobra-frete.png](./BUG-01-carrinho-subtotal-200-cobra-frete.png)
- Tela Finalizar compra: [BUG-01-checkout-subtotal-200-cobra-frete.png](./BUG-01-checkout-subtotal-200-cobra-frete.png)
- Teste automatizado (gerado ao final do TC 2.6): [TC 2.6 - CA06 - Validar frete grátis com subtotal de exatamente R$ 200,00.png](<./TC 2.6 - CA06 - Validar frete grátis com subtotal de exatamente R$ 200,00.png>)

![Carrinho com subtotal de R$ 200,00 cobrando frete](./BUG-01-carrinho-subtotal-200-cobra-frete.png)

---

## BUG-02 – API aceita mais de 5 unidades do mesmo produto

| Campo | Descrição |
|---|---|
| **CA violado** | CA10 – "Cada produto pode ter no máximo 5 unidades por pedido. A regra vale para a interface **e para a API**." |
| **Onde ocorre** | `POST /api/carrinho/calcular` e `POST /api/pedidos` |
| **Severidade** | Média: permite criar pedido fora da regra de negócio. Pela interface não é possível, porque o botão "+" é desabilitado em 5 unidades (validado no `TC 2.10`) |
| **Prioridade** | Média |

### Passos para reproduzir
1. Enviar a requisição abaixo para `POST /api/carrinho/calcular`:
   ```json
   {"itens":[{"produtoId":"P001","quantidade":6}]}
   ```
2. Enviar a mesma lista de itens para `POST /api/pedidos`, com dados válidos do cliente:
   ```json
   {
     "itens":[{"produtoId":"P001","quantidade":6}],
     "cliente":{"nome":"Teste QA","email":"qa@teste.com","cep":"01001-000"}
   }
   ```

### Resultado esperado
As duas chamadas devem responder **422** com o erro documentado `QUANTIDADE_MAXIMA_EXCEDIDA` ("A quantidade de um produto é maior que 5.").

### Resultado obtido
- `/api/carrinho/calcular` responde **200** e calcula 6 unidades (`"quantidade": 6`, `"subtotal": 359.4`).
- `/api/pedidos` responde **201** e cria o pedido (ex.: `"numero": "VZ-599232"`) com 6 unidades.

Outras validações de quantidade funcionam. Por exemplo, `quantidade: 0` responde 422 `QUANTIDADE_INVALIDA`. Só o limite máximo não é validado.
