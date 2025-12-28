export type StatusBarbearia = "ativa" | "em_teste" | "bloqueada" | "cancelada";

export type PlanoContratado = "basico" | "premium" | "enterprise";

export interface GatewayPagamento {
  nome: string;
  conectado: boolean;
  dataConexao?: string;
}

export interface Barbearia {
  id: string;
  nome: string;
  cnpjCpf: string;
  responsavel: string;
  plano: PlanoContratado;
  status: StatusBarbearia;
  dataCriacao: string;
  dataVencimento: string;
  gatewayPagamento: GatewayPagamento;
  email?: string;
  telefone?: string;
  endereco?: string;
}

export interface NovaBarbearia {
  nome: string;
  cnpjCpf: string;
  responsavel: string;
  plano: PlanoContratado;
  email?: string;
  telefone?: string;
  endereco?: string;
}

