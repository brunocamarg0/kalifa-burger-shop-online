# 🧪 Guia de Testes da API iFood

Este guia explica como testar todas as funcionalidades da integração com o iFood no Kalifa Burger Shop.

## 🚀 Como Acessar os Testes

1. Acesse o painel administrativo: `/admin`
2. Clique no botão **"Testes iFood"** na seção de ações
3. Ou acesse diretamente: `/ifood-test`

## 📋 Pré-requisitos

### 1. Configuração das Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# iFood API Configuration
VITE_IFOOD_API_KEY=sua_chave_api_aqui
VITE_IFOOD_MERCHANT_ID=seu_merchant_id_aqui
```

### 2. Obter Credenciais do iFood

1. Acesse o [Painel do Parceiro iFood](https://portal.ifood.com.br)
2. Vá para **Configurações > API**
3. Gere uma nova chave de API
4. Anote o **Merchant ID** do seu estabelecimento

## 🧪 Testes Disponíveis

### 1. Verificar Configuração
- **O que faz**: Verifica se as credenciais do iFood estão configuradas
- **Resultado esperado**: 
  - ✅ "iFood configurado corretamente" (se configurado)
  - ℹ️ "iFood não configurado - usando simulação" (se não configurado)

### 2. Solicitar Entrega
- **O que faz**: Envia uma solicitação de entrega para o iFood
- **Pré-requisito**: Selecionar um pedido
- **Resultado esperado**: 
  - ✅ Entrega aceita com ID único
  - ❌ Erro se credenciais inválidas

### 3. Buscar Status
- **O que faz**: Consulta o status atual da entrega no iFood
- **Pré-requisito**: Ter um ID de entrega válido
- **Resultado esperado**: Status atualizado (preparing, ready, delivering, etc.)

### 4. Simular Entrega
- **O que faz**: Simula uma solicitação de entrega (modo desenvolvimento)
- **Pré-requisito**: Selecionar um pedido
- **Resultado esperado**: Resposta simulada com dados fictícios

### 5. Simular Status
- **O que faz**: Simula uma atualização de status (modo desenvolvimento)
- **Pré-requisito**: Ter um ID de entrega válido
- **Resultado esperado**: Status aleatório simulado

### 6. Cancelar Entrega
- **O que faz**: Cancela uma entrega no iFood
- **Pré-requisito**: Ter um ID de entrega válido
- **Resultado esperado**: Confirmação de cancelamento

### 7. Executar Todos os Testes
- **O que faz**: Executa todos os testes em sequência
- **Pré-requisito**: Selecionar um pedido
- **Resultado esperado**: Relatório completo de todos os testes

## 📊 Interpretando os Resultados

### Status dos Testes

- 🟢 **Success**: Teste executado com sucesso
- 🔴 **Error**: Erro durante a execução do teste
- 🔵 **Info**: Informação ou teste em andamento

### Dados Retornados

#### Resposta da Entrega
```json
{
  "deliveryId": "ifood_123_456789",
  "status": "accepted",
  "estimatedDeliveryTime": "2024-01-15T14:30:00Z",
  "deliveryPartner": {
    "name": "João Silva",
    "phone": "(11) 99999-9999",
    "vehicle": "Moto"
  },
  "trackingUrl": "https://tracking.ifood.com.br/delivery/123"
}
```

#### Status da Entrega
```json
{
  "deliveryId": "ifood_123_456789",
  "status": "delivering",
  "estimatedDeliveryTime": "2024-01-15T14:30:00Z",
  "currentLocation": {
    "latitude": -23.5505,
    "longitude": -46.6333
  },
  "deliveryPartner": {
    "name": "João Silva",
    "phone": "(11) 99999-9999",
    "vehicle": "Moto"
  },
  "updatedAt": "2024-01-15T14:00:00Z"
}
```

## 🔧 Modo de Simulação

Quando as credenciais do iFood não estão configuradas, o sistema usa o **modo de simulação**:

### Características do Modo Simulação
- ✅ Não requer credenciais reais
- ✅ Respostas instantâneas
- ✅ Dados fictícios realistas
- ✅ Ideal para desenvolvimento e testes
- ✅ Não afeta a API real do iFood

### Dados Simulados
- **Entregadores**: Nomes e telefones fictícios
- **Localizações**: Coordenadas de São Paulo
- **Status**: Aleatórios entre os status válidos
- **IDs**: Baseados no ID do pedido + timestamp

## 🚨 Problemas Comuns

### 1. "iFood não está configurado"
**Solução**: Configure as variáveis de ambiente no arquivo `.env.local`

### 2. "Erro na API do iFood"
**Possíveis causas**:
- Credenciais inválidas
- Conta inativa no iFood
- Limite de requisições excedido
- Problemas de conectividade

### 3. "Pedido não encontrado"
**Solução**: Certifique-se de que o pedido existe no sistema

### 4. "Webhook não recebe atualizações"
**Verificar**:
- Endpoint configurado no painel do iFood
- Domínio acessível publicamente
- Firewall não bloqueando requisições

## 📈 Fluxo de Teste Recomendado

1. **Configurar credenciais** (se disponível)
2. **Verificar configuração**
3. **Selecionar um pedido** para teste
4. **Solicitar entrega** (real ou simulada)
5. **Buscar status** da entrega
6. **Simular atualizações** de status
7. **Cancelar entrega** (opcional)
8. **Exportar resultados** para análise

## 📤 Exportando Resultados

Os resultados dos testes podem ser exportados em formato JSON:

1. Clique em **"Exportar"** na aba de resultados
2. O arquivo será baixado automaticamente
3. Contém todos os dados dos testes executados

### Estrutura do Arquivo Exportado
```json
{
  "timestamp": "2024-01-15T14:00:00Z",
  "configuration": {
    "isConfigured": true
  },
  "testResults": [...],
  "deliveryResponse": {...},
  "deliveryStatus": {...}
}
```

## 🔒 Segurança

- ✅ Credenciais armazenadas em variáveis de ambiente
- ✅ Requisições autenticadas com Bearer Token
- ✅ Logs de todas as operações
- ✅ Modo simulação para desenvolvimento seguro

## 📞 Suporte

### Documentação iFood
- [Portal do Desenvolvedor](https://developers.ifood.com.br)
- [Documentação da API](https://developers.ifood.com.br/docs)

### Contatos
- **iFood Suporte**: 0800 777 7777
- **Suporte Técnico**: [seu-email@exemplo.com]

---

**Nota**: Este sistema de testes é ideal para validar a integração antes de usar em produção. Sempre teste extensivamente antes de implementar em ambiente real. 