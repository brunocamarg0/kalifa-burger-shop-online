# API - Estrutura por Domínios

Esta pasta contém as serverless functions do Vercel, organizadas por domínios funcionais para melhor manutenibilidade.

## 📁 Estrutura

```
api/
├── pedidos/           # Gestão de pedidos
├── pagamentos/        # Processamento de pagamentos
│   ├── webhook.js     # Webhook do Mercado Pago
│   └── proxy-pix.js   # Proxy para geração de PIX
├── ifood/             # Integração com iFood
│   └── webhook.js     # Webhook do iFood
└── README.md          # Esta documentação
```

## 🔄 Fluxo de Dados

### Pagamentos
1. **Cliente** → Checkout → Mercado Pago
2. **Mercado Pago** → Webhook → `/api/pagamentos/webhook`
3. **Webhook** → Atualiza status do pedido no Firebase
4. **Admin** → Visualiza atualização em tempo real

### iFood
1. **Admin** → Aprova pedido → Envia para iFood
2. **iFood** → Atualiza status → Webhook → `/api/ifood/webhook`
3. **Webhook** → Atualiza status no Firebase
4. **Admin** → Visualiza atualização em tempo real

## 🛠️ Desenvolvimento

### Testes Locais
```bash
# Testar webhook de pagamento
curl -X POST http://localhost:3000/api/pagamentos/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"payment","data":{"id":"test"}}'

# Testar webhook do iFood
curl -X POST http://localhost:3000/api/ifood/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"order_update","data":{"id":"test"}}'
```

### Variáveis de Ambiente Necessárias
```env
# Firebase
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=

# iFood
IFOOD_CLIENT_ID=
IFOOD_CLIENT_SECRET=
```

## 📊 Monitoramento

Todos os endpoints incluem logs estruturados para monitoramento:

- **Sucesso**: Logs de info com dados relevantes
- **Erro**: Logs de error com stack trace
- **Performance**: Tempo de resposta de cada endpoint

### Exemplo de Log
```json
{
  "timestamp": "2024-12-04T23:05:00.000Z",
  "level": "info",
  "message": "Payment webhook processed",
  "data": {
    "paymentId": "mp_123456",
    "status": "approved"
  },
  "orderId": "order_abc123",
  "sessionId": "session_xyz789"
}
```

## 🔒 Segurança

- **Validação de assinatura** nos webhooks
- **Rate limiting** para prevenir spam
- **Sanitização de dados** de entrada
- **Logs de auditoria** para todas as operações

## 🚀 Deploy

As funções são automaticamente deployadas no Vercel quando há push para a branch main.

### URLs de Produção
- Webhook Pagamentos: `https://seudominio.vercel.app/api/pagamentos/webhook`
- Webhook iFood: `https://seudominio.vercel.app/api/ifood/webhook`
- Proxy PIX: `https://seudominio.vercel.app/api/pagamentos/proxy-pix`

---

**Última atualização:** Dezembro 2024 