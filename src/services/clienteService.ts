// Cliente Service - API Integration for CND System
import { Cliente, CreateClienteDto, UpdateClienteDto } from '@/types/cliente';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class ClienteService {
  private async fetchWithError(url: string, options?: RequestInit): Promise<any> {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // Try to parse the error response from the backend
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Erro na requisição: ${response.status} ${response.statusText}`;
      console.error('API Error:', errorMessage, 'Status:', response.status);
      throw new Error(errorMessage);
    }

    // For 204 No Content, there's no body to parse
    if (response.status === 204) {
      return;
    }

    return response.json();
  }

  // GET /clientes - List all clientes
  async getAllClientes(): Promise<Cliente[]> {
    return this.fetchWithError(`${BASE_URL}/clientes`);
  }

  // GET /clientes/{clienteId} - Get cliente by ID
  async getClienteById(clienteId: number): Promise<Cliente> {
    return this.fetchWithError(`${BASE_URL}/clientes/${clienteId}`);
  }

  // POST /clientes - Create new cliente
  async createCliente(cliente: CreateClienteDto): Promise<Cliente> {
    return this.fetchWithError(`${BASE_URL}/clientes`, {
      method: 'POST',
      body: JSON.stringify(cliente),
    });
  }

  // PUT /clientes/{idEmpresa} - Update existing cliente
  async updateCliente(cliente: UpdateClienteDto): Promise<Cliente> {
    if (!cliente.empresa?.idEmpresa) {
      throw new Error("idEmpresa is required for updating a cliente.");
    }
    return this.fetchWithError(`${BASE_URL}/clientes/${cliente.empresa.idEmpresa}`, {
      method: 'PUT',
      body: JSON.stringify(cliente),
    });
  }

  // DELETE /clientes/{clienteId} - Delete cliente
  async deleteCliente(clienteId: number): Promise<void> {
    await this.fetchWithError(`${BASE_URL}/clientes/${clienteId}`, {
      method: 'DELETE',
    });
  }

  // Bulk delete - Delete multiple clientes
  async deleteMultipleClientes(clienteIds: number[]): Promise<void> {
    // The backend does not support a bulk delete endpoint, so we call deleteCliente for each ID.
    // Promise.all ensures all delete requests are sent concurrently.
    await Promise.all(clienteIds.map(id => this.deleteCliente(id)));
  }
}

export const clienteService = new ClienteService();