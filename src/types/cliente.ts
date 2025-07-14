// Types for Cliente entity - CND System
export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cnpj?: string; // Optional field as mentioned in requirements
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClienteDto {
  nome: string;
  email: string;
  telefone: string;
  cnpj?: string;
}

export interface UpdateClienteDto extends CreateClienteDto {
  id: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ClienteListResponse extends ApiResponse<Cliente[]> {}
export interface ClienteResponse extends ApiResponse<Cliente> {}