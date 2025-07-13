# Configuração do Mercado Pago para Pagamentos Reais

## 🚀 Como Configurar Pagamentos Reais

### 1. **Criar Conta no Mercado Pago**
- Acesse: [https://www.mercadopago.com.br/](https://www.mercadopago.com.br/)
- Clique em "Cadastre-se" e crie sua conta
- Complete a verificação de identidade
- Configure sua conta como vendedor

### 2. **Obter Credenciais de Acesso**
- Acesse: [https://www.mercadopago.com.br/developers/panel/credentials](https://www.mercadopago.com.br/developers/panel/credentials)
- Copie o **Access Token** (Production ou Sandbox)
- **Sandbox**: Para testes (não debita dinheiro real)
- **Production**: Para pagamentos reais

### 3. **Configurar Variáveis de Ambiente**

#### **Para Desenvolvimento Local:**
Crie um arquivo `.env` na raiz do projeto:

```env
# Mercado Pago
VITE_MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Firebase (já existentes)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456789
```

#### **Para Produção (Vercel):**
1. Acesse o painel do Vercel
2. Vá em "Settings" → "Environment Variables"
3. Adicione: `VITE_MERCADOPAGO_ACCESS_TOKEN` com seu token de produção

### 4. **Configurar Webhooks (Opcional)**
- No painel do Mercado Pago, vá em "Webhooks"
- Adicione a URL: `https://seu-dominio.vercel.app/api/payment-webhook`
- Isso permite notificações automáticas de pagamentos

### 5. **Testar Pagamentos**

#### **Modo Sandbox (Teste):**
- Use cartões de teste do Mercado Pago
- PIX de teste funciona normalmente
- Não há cobrança real

#### **Modo Production (Real):**
- Use cartões reais
- PIX real com QR Code
- Dinheiro é debitado/creditado normalmente

---

## 💳 Métodos de Pagamento Disponíveis

### **1. Mercado Pago (Checkout Completo)**
- ✅ Cartão de crédito (até 12x)
- ✅ Cartão de débito
- ✅ PIX
- ✅ Boleto bancário
- ✅ Carteira Mercado Pago

### **2. PIX Direto**
- ✅ QR Code gerado automaticamente
- ✅ Código PIX para copiar
- ✅ Pagamento instantâneo

### **3. Dinheiro na Entrega**
- ✅ Pedido processado normalmente
- ✅ Pagamento no momento da entrega

---

## 🔧 Como Funciona

### **Fluxo de Pagamento:**

1. **Cliente escolhe método de pagamento**
2. **Sistema cria pedido no banco de dados**
3. **Mercado Pago gera preferência de pagamento**
4. **Cliente é redirecionado para checkout**
5. **Após pagamento, cliente retorna ao site**
6. **Sistema atualiza status do pedido**

### **Para PIX Direto:**
1. **Sistema gera QR Code PIX**
2. **Cliente escaneia ou copia código**
3. **Pagamento é processado instantaneamente**
4. **Status é atualizado automaticamente**

---

## 💰 Taxas e Custos

### **Mercado Pago:**
- **Cartão de crédito**: ~4.99% + R$ 0,60
- **Cartão de débito**: ~3.99% + R$ 0,60
- **PIX**: ~1.99% + R$ 0,60
- **Boleto**: ~3.99% + R$ 0,60

### **Prazo de Recebimento:**
- **PIX**: Instantâneo
- **Cartão de débito**: 1-2 dias úteis
- **Cartão de crédito**: 1-2 dias úteis
- **Boleto**: 3-5 dias úteis

---

## 🧪 Teste em Desenvolvimento

### **Cartões de Teste:**
```
MASTERCARD: 5031 4332 1540 6351
VISA: 4509 9535 6623 3704
ELO: 6363 6800 0000 0006

CVV: 123
Data: 12/25
Nome: Qualquer nome
```

### **PIX de Teste:**
- Funciona normalmente com QR Code
- Use qualquer app de pagamento
- Não há cobrança real

---

## 🚀 Deploy em Produção

### **1. Configurar Token de Produção**
- Substitua o token de sandbox pelo de produção
- Configure no Vercel ou servidor

### **2. Configurar Webhooks**
- Adicione URL de webhook no Mercado Pago
- Teste se está funcionando

### **3. Testar com Valores Pequenos**
- Faça testes com R$ 1,00 primeiro
- Confirme se está funcionando

### **4. Monitorar Pagamentos**
- Use o painel do Mercado Pago
- Verifique logs do sistema

---

## 🔒 Segurança

### **Boas Práticas:**
- ✅ Nunca exponha tokens no frontend
- ✅ Use HTTPS em produção
- ✅ Valide dados do cliente
- ✅ Configure webhooks para confirmação
- ✅ Monitore transações suspeitas

### **PCI Compliance:**
- Mercado Pago é PCI DSS compliant
- Dados de cartão não passam pelo seu servidor
- Segurança máxima garantida

---

## 📊 Monitoramento

### **Painel do Mercado Pago:**
- Todas as transações
- Relatórios detalhados
- Análise de fraudes
- Dashboard em tempo real

### **Logs do Sistema:**
```javascript
💳 Criando preferência de pagamento no Mercado Pago...
📦 Itens: [{id: "1", title: "Classic Burger", quantity: 2, unit_price: 25}]
👤 Cliente: João Silva
✅ Preferência criada com sucesso!
🔗 Init Point: https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...
```

---

## 🆘 Solução de Problemas

### **Erro de Token:**
- Verifique se o token está correto
- Confirme se não há espaços extras
- Teste se o token está ativo

### **Pagamento não processado:**
- Verifique logs do console
- Confirme dados do cliente
- Teste com cartão de teste

### **PIX não gera:**
- Verifique configuração do PIX
- Confirme dados do cliente
- Teste com valor pequeno

---

## 📞 Suporte

- **Mercado Pago**: [https://www.mercadopago.com.br/developers/support](https://www.mercadopago.com.br/developers/support)
- **Documentação**: [https://www.mercadopago.com.br/developers/docs](https://www.mercadopago.com.br/developers/docs)
- **Status**: [https://status.mercadopago.com.br/](https://status.mercadopago.com.br/)

---

**Dica:** Comece sempre com o modo sandbox para testar. Só mude para produção quando estiver tudo funcionando perfeitamente! 