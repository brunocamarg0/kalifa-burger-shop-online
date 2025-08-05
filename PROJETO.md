# Kalifa Burger Shop - Documentação Completa

## 📋 Sumário

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Setup Local](#setup-local)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Fluxo da Aplicação](#fluxo-da-aplicação)
- [Painel Administrativo](#painel-administrativo)
- [Integrações](#integrações)
- [Deploy](#deploy)
- [Apêndice](#apêndice)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes UI
- **React Router** - Roteamento
- **React Query** - Gerenciamento de estado e cache

### Backend & Serviços
- **Firebase** - Autenticação, banco de dados e hosting
- **Mercado Pago** - Processamento de pagamentos
- **iFood API** - Integração com delivery
- **Vercel** - Deploy e serverless functions

### Ferramentas de Desenvolvimento
- **Bun** - Package manager e runtime
- **ESLint** - Linting
- **PostCSS** - Processamento CSS

## 🚀 Setup Local

### Pré-requisitos
- Node.js 18+ ou Bun
- Git

### Instalação

```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd kalifa-burger-shop-online

# Instale as dependências
bun install
# ou
npm install

# Configure as variáveis de ambiente
cp env.example .env
# Edite o arquivo .env com suas credenciais

# Execute o projeto
bun dev
# ou
npm run dev
```

### Variáveis de Ambiente Necessárias

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Mercado Pago
VITE_MERCADOPAGO_ACCESS_TOKEN=
VITE_MERCADOPAGO_PUBLIC_KEY=

# iFood
VITE_IFOOD_CLIENT_ID=
VITE_IFOOD_CLIENT_SECRET=
VITE_IFOOD_USERNAME=
VITE_IFOOD_PASSWORD=
```

## 📁 Estrutura do Projeto

```
kalifa-burger-shop-online/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes base (shadcn/ui)
│   │   └── ...             # Componentes específicos
│   ├── pages/              # Páginas da aplicação
│   ├── contexts/           # Contextos React
│   ├── hooks/              # Custom hooks
│   ├── services/           # Serviços externos
│   ├── types/              # Definições TypeScript
│   └── lib/                # Utilitários
├── api/                    # Serverless functions (Vercel)
├── public/                 # Arquivos estáticos
└── scripts/                # Scripts utilitários
```

## 🔄 Fluxo da Aplicação

### Fluxo do Cliente
1. **Acesso inicial** → Página principal com menu
2. **Seleção de produtos** → Adição ao carrinho
3. **Checkout** → Formulário de dados pessoais
4. **Pagamento** → Integração com Mercado Pago ou PIX
5. **Confirmação** → Redirecionamento baseado no status

### Fluxo Administrativo
1. **Login** → `/painel-da-dona` (admin/kalifa2024)
2. **Dashboard** → Visualização de pedidos em tempo real
3. **Gestão** → Aprovação/rejeição de pedidos
4. **Integração iFood** → Envio automático de pedidos

### Fluxo de Pagamento
```
Cliente → Checkout → Mercado Pago → Webhook → Firebase → Admin
```

## 👨‍💼 Painel Administrativo

### Acesso
- **URL:** `/painel-da-dona`
- **Usuário:** `admin`
- **Senha:** `kalifa2024`

### Funcionalidades
- Visualização de pedidos em tempo real
- Aprovação/rejeição de pedidos
- Integração automática com iFood
- Gestão de status de entrega
- Histórico de transações

## 🔗 Integrações

### Mercado Pago
- Processamento de pagamentos
- Webhooks para confirmação
- Suporte a PIX e cartão

### iFood
- Envio automático de pedidos
- Acompanhamento de status
- Gestão de entregas

### Firebase
- Autenticação
- Banco de dados em tempo real
- Hosting da aplicação

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Firebase Hosting
```bash
# Build
npm run build

# Deploy
firebase deploy
```

## 📚 Apêndice

### Documentação Específica
- [Configuração Firebase](./FIREBASE_SETUP.md)
- [Configuração Mercado Pago](./MERCADOPAGO_SETUP.md)
- [Configuração iFood](./CONFIGURACAO_IFOOD.md)
- [Guia de Testes iFood](./GUIA_TESTES_IFOOD.md)
- [Guia Avançado de Testes iFood](./GUIA_TESTES_IFOOD_AVANCADO.md)
- [Configuração de Pagamentos](./CONFIGURACAO_PAGAMENTO.md)
- [Estrutura da API](./api/README.md)

### Melhorias Implementadas

#### ✅ Documentação Centralizada
- Criado `PROJETO.md` com documentação completa
- Padronização de nomenclatura (PT-BR)
- Estrutura organizada com sumário e apêndices

#### ✅ Estrutura de Testes
- Configuração do Vitest com React Testing Library
- Testes unitários para componentes
- Testes de integração para serviços
- Scripts de teste: `bun test`, `bun test:ui`, `bun test:coverage`

#### ✅ Sistema de Logs Estruturado
- Logger centralizado em `src/lib/logger.ts`
- Logs específicos para eventos de negócio
- Integração preparada para monitoramento (Sentry, LogRocket)
- Logs de auditoria para ações administrativas

#### ✅ Organização da API por Domínios
- `/api/pedidos/` - Gestão de pedidos
- `/api/pagamentos/` - Processamento de pagamentos
- `/api/ifood/` - Integração com iFood
- Documentação específica da API

### Scripts Úteis
```bash
# Desenvolvimento
bun dev                    # Servidor de desenvolvimento
bun build                  # Build de produção
bun preview               # Preview do build

# Testes
bun test                  # Executar todos os testes
bun test:ui               # Interface visual dos testes
bun test:coverage         # Relatório de cobertura
bun run test:ifood        # Teste da integração iFood

# Linting
bun run lint              # Verificação de código

# Logs
# Os logs são exibidos automaticamente no console
# Em produção, são enviados para monitoramento
```

### Estrutura de Dados

#### Pedido (Order)
```typescript
interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Item do Carrinho (CartItem)
```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  extras?: string[];
}
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de CORS**
   - Verificar configurações do Firebase
   - Checar regras do Firestore

2. **Pagamento não processado**
   - Verificar webhooks do Mercado Pago
   - Checar logs do Vercel

3. **Integração iFood falhando**
   - Verificar credenciais
   - Checar logs de erro

### Logs e Monitoramento
- Console do navegador para erros frontend
- Logs do Vercel para serverless functions
- Firebase Console para dados e autenticação

---

**Última atualização:** Dezembro 2024
**Versão:** 1.0.0 