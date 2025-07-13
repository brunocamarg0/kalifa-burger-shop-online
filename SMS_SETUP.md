# Sistema de SMS - Kalifa Burger

## 📱 Funcionalidades Implementadas

O sistema de SMS foi implementado para enviar notificações automáticas aos clientes em diferentes etapas do pedido:

### 1. **SMS de Confirmação de Pedido**
- Enviado automaticamente quando um pedido é criado
- Contém: número do pedido, itens, valor total, horário estimado de entrega
- Formato: `🍔 Kalifa Burger - Pedido Confirmado!`

### 2. **SMS de Atualização de Status**
- Enviado quando o status do pedido é alterado no painel admin
- Status: Preparando, Pronto, Entregando, Entregue, Cancelado
- Formato: `🍔 Kalifa Burger - [Status]`

### 3. **Validação de Telefone**
- Validação automática do formato brasileiro
- Formatação automática: `(11) 99999-9999`
- Feedback visual no formulário

## 🔧 Configuração para Produção

### 1. **Escolher Provedor de SMS**

Recomendamos um destes provedores brasileiros:

#### **Twilio (Recomendado)**
```bash
npm install twilio
```

#### **Zenvia (Ex-SendGrid)**
```bash
npm install @zenvia/sdk
```

#### **Locaweb**
- API REST simples
- Documentação em português

### 2. **Configurar Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Twilio
VITE_TWILIO_ACCOUNT_SID=seu_account_sid
VITE_TWILIO_AUTH_TOKEN=seu_auth_token
VITE_TWILIO_PHONE_NUMBER=+5511999999999

# Ou Zenvia
VITE_ZENVIA_API_KEY=sua_api_key
VITE_ZENVIA_PHONE_NUMBER=5511999999999
```

### 3. **Atualizar o Serviço de SMS**

Substitua o código simulado em `src/services/smsService.ts`:

#### **Exemplo com Twilio:**
```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.VITE_TWILIO_ACCOUNT_SID,
  process.env.VITE_TWILIO_AUTH_TOKEN
);

async sendOrderConfirmation(order: Order): Promise<boolean> {
  try {
    const message = this.formatOrderConfirmationMessage(order);
    
    await client.messages.create({
      body: message,
      from: process.env.VITE_TWILIO_PHONE_NUMBER,
      to: `+55${order.customer.phone.replace(/\D/g, '')}`
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar SMS:', error);
    return false;
  }
}
```

#### **Exemplo com Zenvia:**
```typescript
import { Client, TextContent } from '@zenvia/sdk';

const client = new Client(process.env.VITE_ZENVIA_API_KEY);

async sendOrderConfirmation(order: Order): Promise<boolean> {
  try {
    const message = this.formatOrderConfirmationMessage(order);
    
    await client.getChannel('sms').sendMessage(
      process.env.VITE_ZENVIA_PHONE_NUMBER,
      order.customer.phone,
      new TextContent(message)
    );
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar SMS:', error);
    return false;
  }
}
```

## 📊 Monitoramento e Logs

### **Logs Implementados:**
- ✅ Confirmação de envio
- ❌ Erros de envio
- ⚠️ Números inválidos
- 📱 Detalhes da mensagem

### **Console do Navegador:**
```javascript
// Exemplo de logs que aparecem no console
📱 Enviando SMS de confirmação para: (11) 99999-9999
💬 Mensagem: 🍔 Kalifa Burger - Pedido Confirmado!...
✅ SMS enviado com sucesso!
```

## 🧪 Teste em Desenvolvimento

### **1. Teste Local:**
- O sistema simula o envio de SMS
- Logs aparecem no console do navegador
- Não há custo durante desenvolvimento

### **2. Teste com Número Real:**
1. Configure um provedor de SMS
2. Use seu próprio número para testes
3. Verifique se as mensagens chegam corretamente

## 💰 Custos Estimados

### **Twilio:**
- ~R$ 0,15 por SMS
- Plano gratuito: 15 SMS/mês

### **Zenvia:**
- ~R$ 0,12 por SMS
- Plano gratuito: 50 SMS/mês

### **Locaweb:**
- ~R$ 0,10 por SMS
- Pacotes a partir de R$ 50

## 🔒 Segurança e Privacidade

### **Boas Práticas:**
- ✅ Validação de números de telefone
- ✅ Formatação automática
- ✅ Logs de erro detalhados
- ✅ Rate limiting (implementar se necessário)

### **LGPD:**
- ✅ Consentimento explícito do cliente
- ✅ Finalidade específica (notificações de pedido)
- ✅ Armazenamento seguro dos dados

## 🚀 Deploy

### **Vercel:**
1. Configure as variáveis de ambiente no painel do Vercel
2. Faça deploy normalmente
3. Teste com um pedido real

### **Outros Provedores:**
- Configure as variáveis de ambiente no seu servidor
- Certifique-se de que o domínio está autorizado

## 📞 Suporte

Para dúvidas sobre implementação:
- Consulte a documentação do provedor escolhido
- Verifique os logs no console do navegador
- Teste com números válidos brasileiros

---

**Nota:** O sistema atual está em modo de demonstração. Para usar em produção, configure um provedor de SMS real seguindo as instruções acima. 