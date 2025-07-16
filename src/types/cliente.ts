// Types for Cliente entity - CND System

// Interface para a entidade Empresa, conforme esperado pela API
export interface Empresa {
  idEmpresa: string;
  nomeEmpresa: string;
  cnpj: string;
}

// Interface para a entidade Cliente, conforme retornado pela API
export interface Cliente {
  id: number;
  cnpj: string;
  periodicidade: number;
  statusCliente: string;
  nacional: boolean;
  municipal: boolean;
  estadual: boolean;
  empresa: Empresa;
}

// DTO para a criação de um novo cliente
export interface CreateClienteDto {
  cnpj: string;
  periodicidade: number;
  statusCliente: string;
  nacional: boolean;
  municipal: boolean;
  estadual: boolean;
  empresa: {
    idEmpresa: string;
    nomeEmpresa: string;
    cnpj: string;
  };
}

// DTO para a atualização de um cliente existente
export interface UpdateClienteDto extends Partial<CreateClienteDto> {}