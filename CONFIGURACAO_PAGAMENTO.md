# 🔧 Configuração de Pagamento - Kalifa Burger

## ✅ Access Token Configurado

Seu Access Token do Mercado Pago foi configurado:
```
APP_USR-8198153225284103-071221-68070ac52617404b0cdf2c61202ce95c-2557085916
```

## 📝 Próximos Passos

### 1. **Criar arquivo .env na raiz do projeto**

Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Mercado Pago - Access Token de Produção
VITE_MERCADOPAGO_ACCESS_TOKEN=APP_USR-8198153225284103-071221-68070ac52617404b0cdf2c61202ce95c-2557085916

# Firebase (substitua pelas suas configurações reais)
VITE_FIREBASE_API_KEY=sua_firebase_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456789
```

### 2. **Configurar no Vercel**

1. Acesse o painel do Vercel do seu projeto
2. Vá em "Settings" → "Environment Variables"
3. Adicione a variável:
   - **Name**: `VITE_MERCADOPAGO_ACCESS_TOKEN`
   - **Value**: `APP_USR-8198153225284103-071221-68070ac52617404b0cdf2c61202ce95c-2557085916`
   - **Environment**: Production, Preview, Development

### 3. **Testar Pagamentos**

Depois de configurar, você pode testar:

#### **Cartões Reais (Pagamento Real):**
- Use qualquer cartão de crédito/débito real
- O dinheiro será debitado normalmente
- Taxa: ~4.99% + R$ 0,60

#### **PIX Real:**
- QR Code gerado automaticamente
- Pagamento instantâneo
- Taxa: ~1.99% + R$ 0,60

## ⚠️ Importante

- Este é um token de **PRODUÇÃO**
- Pagamentos serão **REAIS**
- Dinheiro será **DEBITADO/CREDITADO** normalmente
- Teste primeiro com valores pequenos (R$ 1,00)

## 🚀 Status

✅ Access Token configurado
⏳ Aguardando configuração no Vercel
⏳ Aguardando teste de pagamento

**Me envie o link do seu projeto no Vercel para eu te ajudar a configurar lá também!** 