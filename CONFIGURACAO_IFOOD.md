# 🚚 Configuração da Integração iFood

Este documento explica como configurar a integração com o iFood para gerenciamento de entregas no Kalifa Burger Shop.

## 📋 Pré-requisitos

1. **Conta no iFood para Empresas**
   - Cadastro aprovado no iFood
   - Acesso ao painel de parceiros
   - Credenciais de API

2. **Variáveis de Ambiente**
   - `VITE_IFOOD_API_KEY`: Chave de API do iFood
   - `VITE_IFOOD_MERCHANT_ID`: ID do estabelecimento no iFood

## 🔧 Configuração

### 1. Obter Credenciais do iFood

1. Acesse o [Painel do Parceiro iFood](https://portal.ifood.com.br)
2. Vá para **Configurações > API**
3. Gere uma nova chave de API
4. Anote o **Merchant ID** do seu estabelecimento

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# iFood API Configuration
VITE_IFOOD_API_KEY=sua_chave_api_aqui
VITE_IFOOD_MERCHANT_ID=seu_merchant_id_aqui
```

### 3. Configurar Webhook

1. No painel do iFood, vá para **Configurações > Webhooks**
2. Adicione o endpoint do webhook:
   ```
   https://seu-dominio.vercel.app/api/ifood-webhook
   ```
3. Configure os eventos para receber:
   - `delivery.status_changed`
   - `delivery.partner_assigned`
   - `delivery.location_updated`

## 🚀 Como Usar

### 1. Solicitar Entrega

1. Acesse o painel administrativo
2. Vá para a aba **"Entregas"**
3. Clique em **"Gerenciar Entrega"** no pedido desejado
4. Clique em **"Solicitar Entrega iFood"**

### 2. Acompanhar Status

- O status da entrega é atualizado automaticamente via webhook
- Você pode atualizar manualmente clicando em **"Atualizar Status"**
- O link de tracking abre diretamente no app do iFood

### 3. Cancelar Entrega

- Use o botão **"Cancelar"** para cancelar entregas
- Confirme a ação no diálogo de confirmação

## 📊 Status de Entrega

| Status iFood | Status Interno | Descrição |
|--------------|----------------|-----------|
| `accepted` | - | Entrega aceita pelo iFood |
| `preparing` | `preparing` | Pedido em preparação |
| `ready` | `ready` | Pedido pronto para entrega |
| `picked_up` | `delivering` | Entregador retirou o pedido |
| `delivering` | `delivering` | Pedido em trânsito |
| `delivered` | `delivered` | Pedido entregue |
| `cancelled` | `cancelled` | Entrega cancelada |

## 🔍 Funcionalidades

### ✅ Implementadas

- [x] Solicitar entrega no iFood
- [x] Receber atualizações via webhook
- [x] Acompanhar status em tempo real
- [x] Visualizar informações do entregador
- [x] Cancelar entregas
- [x] Link de tracking
- [x] Simulação para desenvolvimento

### 🚧 Em Desenvolvimento

- [ ] Integração com múltiplos provedores (Rappi, Uber Eats)
- [ ] Notificações push para entregadores
- [ ] Relatórios de entrega
- [ ] Configuração de taxas por região

## 🧪 Modo de Desenvolvimento

Para desenvolvimento e testes, o sistema usa simulações quando as credenciais do iFood não estão configuradas:

- **Solicitar entrega**: Simula resposta do iFood
- **Atualizar status**: Gera status aleatórios
- **Cancelar entrega**: Simula cancelamento

## 🔒 Segurança

- Todas as requisições são autenticadas com Bearer Token
- Webhooks são validados pelo iFood
- Dados sensíveis são armazenados em variáveis de ambiente
- Logs de todas as operações para auditoria

## 📞 Suporte

### Problemas Comuns

1. **"iFood não está configurado"**
   - Verifique se as variáveis de ambiente estão definidas
   - Reinicie o servidor após adicionar as variáveis

2. **"Erro na API do iFood"**
   - Verifique se as credenciais estão corretas
   - Confirme se a conta está ativa no iFood

3. **"Webhook não recebe atualizações"**
   - Verifique se o endpoint está configurado no painel do iFood
   - Confirme se o domínio está acessível publicamente

### Contatos

- **iFood Suporte**: 0800 777 7777
- **Documentação iFood**: https://developers.ifood.com.br
- **Suporte Técnico**: [seu-email@exemplo.com]

## 📈 Próximos Passos

1. **Testar em Produção**
   - Configurar credenciais reais
   - Testar com pedidos reais
   - Monitorar logs e performance

2. **Otimizações**
   - Implementar cache de status
   - Adicionar retry automático
   - Melhorar tratamento de erros

3. **Expansão**
   - Integrar com outros provedores
   - Adicionar analytics de entrega
   - Implementar notificações automáticas

---

**Nota**: Esta integração está em desenvolvimento. Para uso em produção, recomenda-se testes extensivos e validação com o suporte do iFood. 