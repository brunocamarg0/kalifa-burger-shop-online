# Configuração do Twilio para SMS Reais

## 🚀 Passo a Passo para Configurar SMS Reais

### 1. **Criar Conta no Twilio**

1. Acesse: https://www.twilio.com/
2. Clique em "Sign up for free"
3. Preencha seus dados
4. Verifique seu email e telefone

### 2. **Obter Credenciais**

Após criar a conta, você encontrará suas credenciais em:
- **Console**: https://console.twilio.com/
- **Account SID**: Copie o "Account SID"
- **Auth Token**: Copie o "Auth Token"

### 3. **Comprar Número de Telefone**

1. No console do Twilio, vá em "Phone Numbers" → "Manage" → "Buy a number"
2. Escolha um número brasileiro
3. Ative as funcionalidades: "SMS" e "Voice"
4. Anote o número comprado

### 4. **Configurar Variáveis de Ambiente**

#### **Para Desenvolvimento Local:**
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcdef
VITE_TWILIO_AUTH_TOKEN=your_auth_token_here
VITE_TWILIO_PHONE_NUMBER=+5511999999999
```

#### **Para Produção (Vercel):**
1. Acesse o painel do Vercel
2. Vá em "Settings" → "Environment Variables"
3. Adicione as 3 variáveis acima

### 5. **Testar Configuração**

1. Faça um pedido no site
2. Use seu próprio número de telefone
3. Verifique se o SMS chega
4. Consulte os logs no console do navegador

## 💰 Custos do Twilio

### **Plano Gratuito:**
- $15 de crédito gratuito
- ~100 SMS gratuitos
- Válido para sempre

### **Após o Crédito Gratuito:**
- ~$0.0079 por SMS (EUA)
- ~$0.15 por SMS (Brasil)
- Sem taxa mensal

## 🔧 Solução de Problemas

### **SMS não chega:**
1. Verifique se o número está no formato correto
2. Confirme se as credenciais estão corretas
3. Verifique os logs no console do Twilio
4. Teste com seu próprio número primeiro

### **Erro de autenticação:**
1. Verifique Account SID e Auth Token
2. Certifique-se de que não há espaços extras
3. Recrie o Auth Token se necessário

### **Número inválido:**
1. Use formato brasileiro: (11) 99999-9999
2. O sistema adiciona automaticamente +55
3. Teste com números reais

## 📱 Exemplo de SMS

### **Confirmação de Pedido:**
```
🍔 Kalifa Burger - Pedido Confirmado!

Pedido #KAL-ABC123
Itens: 2x Classic Burger, 1x Bacon Burger
Total: R$ 45.00
Entrega estimada: 14:30

Acompanhe seu pedido em tempo real!
Obrigado por escolher a Kalifa Burger! 🎉
```

### **Atualização de Status:**
```
🍔 Kalifa Burger - 🍳 Seu pedido está sendo preparado!

Pedido #KAL-ABC123
Status: Preparando

Acompanhe seu pedido em tempo real!
```

## 🛡️ Segurança

### **Boas Práticas:**
- ✅ Nunca compartilhe suas credenciais
- ✅ Use variáveis de ambiente
- ✅ Monitore o uso de créditos
- ✅ Configure webhooks para delivery status

### **Rate Limiting:**
- Máximo 1 SMS por segundo por número
- Máximo 1000 SMS por dia (conta gratuita)
- Configure alertas de uso

## 📊 Monitoramento

### **Console do Twilio:**
- Logs de todos os SMS enviados
- Status de entrega
- Erros e falhas
- Uso de créditos

### **Logs do Sistema:**
```javascript
📱 Enviando SMS de confirmação...
📞 Para: (11) 99999-9999
💬 Mensagem: 🍔 Kalifa Burger - Pedido Confirmado!...
✅ SMS real enviado com sucesso! SID: SM1234567890abcdef
```

## 🚀 Deploy

### **Vercel:**
1. Configure as variáveis de ambiente
2. Faça push para o GitHub
3. O Vercel fará deploy automaticamente
4. Teste com um pedido real

### **Outros Provedores:**
- Configure as variáveis no seu servidor
- Certifique-se de que a API function está acessível
- Teste a conectividade

---

**Dica:** Comece com o plano gratuito do Twilio para testar. É suficiente para a maioria dos casos de uso iniciais! 