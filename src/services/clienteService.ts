// Cliente Service - API Integration for CND System
import { Cliente, CreateClienteDto, UpdateClienteDto, ClienteListResponse, ClienteResponse } from '@/types/cliente';

// NOTE: Replace BASE_URL with your actual API endpoint
// In Vite, use import.meta.env instead of process.env
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ClienteService {
  private async fetchWithError(url: string, options?: RequestInit): Promise<Response> {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  // GET /clientes - List all clientes
  async getAllClientes(): Promise<Cliente[]> {
    try {
      const response = await this.fetchWithError(`${BASE_URL}/clientes`);
      const data: ClienteListResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching clientes:', error);
      throw new Error('Failed to fetch clientes');
    }
  }

  // GET /clientes/{clienteId} - Get cliente by ID
  async getClienteById(clienteId: number): Promise<Cliente> {
    try {
      const response = await this.fetchWithError(`${BASE_URL}/clientes/${clienteId}`);
      const data: ClienteResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching cliente:', error);
      throw new Error('Failed to fetch cliente');
    }
  }

  // POST /clientes - Create new cliente
  async createCliente(cliente: CreateClienteDto): Promise<Cliente> {
    try {
      const response = await this.fetchWithError(`${BASE_URL}/clientes`, {
        method: 'POST',
        body: JSON.stringify(cliente),
      });
      const data: ClienteResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating cliente:', error);
      throw new Error('Failed to create cliente');
    }
  }

  // PUT /clientes/{clienteId} - Update existing cliente
  async updateCliente(clienteId: number, cliente: UpdateClienteDto): Promise<Cliente> {
    try {
      const response = await this.fetchWithError(`${BASE_URL}/clientes/${clienteId}`, {
        method: 'PUT',
        body: JSON.stringify(cliente),
      });
      const data: ClienteResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating cliente:', error);
      throw new Error('Failed to update cliente');
    }
  }

  // DELETE /clientes/{clienteId} - Delete cliente
  async deleteCliente(clienteId: number): Promise<void> {
    try {
      await this.fetchWithError(`${BASE_URL}/clientes/${clienteId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting cliente:', error);
      throw new Error('Failed to delete cliente');
    }
  }

  // Bulk delete - Delete multiple clientes
  async deleteMultipleClientes(clienteIds: number[]): Promise<void> {
    try {
      // NOTE: Implement bulk delete endpoint if available, otherwise delete one by one
      await Promise.all(clienteIds.map(id => this.deleteCliente(id)));
    } catch (error) {
      console.error('Error deleting multiple clientes:', error);
      throw new Error('Failed to delete clientes');
    }
  }
}

export const clienteService = new ClienteService();