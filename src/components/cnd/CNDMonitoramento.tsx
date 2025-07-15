// CND Monitoramento - Main Screen Component
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Users, 
  Loader2,
  Building2,
  Phone,
  Mail
} from 'lucide-react';
import { Cliente, CreateClienteDto } from '@/types/cliente';
import { clienteService } from '@/services/clienteService';
import { ClienteFormModal } from './ClienteFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const CNDMonitoramento: React.FC = () => {
  // State management
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchNome, setSearchNome] = useState('');
  const [searchCNPJ, setSearchCNPJ] = useState('');
  const [selectedClientes, setSelectedClientes] = useState<Set<number>>(new Set());
  const [lastEmpresaId, setLastEmpresaId] = useState(0);
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { toast } = useToast();

  // Load clientes on component mount
  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.getAllClientes();
      setClientes(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive",
      });
      // Mock data for development/testing
      setClientes([
        { id: 1, nome: "Empresa ABC Ltda", email: "contato@empresaabc.com", telefone: "(11) 99999-9999", cnpj: "12.345.678/0001-90" },
        { id: 2, nome: "Comércio XYZ S.A.", email: "admin@comercioxyz.com", telefone: "(11) 88888-8888", cnpj: "98.765.432/0001-10" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filtered clientes based on search
  const filteredClientes = useMemo(() => {
    return clientes.filter(cliente => {
      const matchesNome = cliente.nome.toLowerCase().includes(searchNome.toLowerCase());
      const matchesCNPJ = !searchCNPJ || (cliente.cnpj && cliente.cnpj.includes(searchCNPJ));
      return matchesNome && matchesCNPJ;
    });
  }, [clientes, searchNome, searchCNPJ]);

  // Handle form submission (create/update)
  const handleFormSubmit = async (formData: CreateClienteDto) => {
    try {
      setFormLoading(true);
      
      if (editingCliente) {
        // Update existing cliente
        await clienteService.updateCliente(editingCliente.id, { ...formData, id: editingCliente.id });
        toast({
          title: "Cliente atualizado",
          description: "Os dados do cliente foram atualizados com sucesso.",
        });
      } else {
        // Create new cliente
        await clienteService.createCliente(formData);
        toast({
          title: "Cliente cadastrado",
          description: "O novo cliente foi cadastrado com sucesso.",
        });
      }
      
      await loadClientes();
      setIsFormModalOpen(false);
      setEditingCliente(null);
    } catch (error) {
      toast({
        title: "Erro ao salvar cliente",
        description: "Não foi possível salvar os dados do cliente.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      
      if (selectedClientes.size > 1) {
        // Bulk delete
        await clienteService.deleteMultipleClientes(Array.from(selectedClientes));
        toast({
          title: "Clientes excluídos",
          description: `${selectedClientes.size} cliente(s) foram excluídos com sucesso.`,
        });
      } else {
        // Single delete
        const clienteId = Array.from(selectedClientes)[0];
        await clienteService.deleteCliente(clienteId);
        toast({
          title: "Cliente excluído",
          description: "O cliente foi excluído com sucesso.",
        });
      }
      
      await loadClientes();
      setSelectedClientes(new Set());
    } catch (error) {
      toast({
        title: "Erro ao excluir cliente(s)",
        description: "Não foi possível excluir o(s) cliente(s) selecionado(s).",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle individual checkbox selection
  const handleClienteSelect = (clienteId: number, checked: boolean) => {
    const newSelected = new Set(selectedClientes);
    if (checked) {
      newSelected.add(clienteId);
    } else {
      newSelected.delete(clienteId);
    }
    setSelectedClientes(newSelected);
  };

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClientes(new Set(filteredClientes.map(c => c.id)));
    } else {
      setSelectedClientes(new Set());
    }
  };

  // Open edit modal
  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setIsFormModalOpen(true);
  };

  // Open delete modal
  const handleDeleteClick = (clienteId?: number) => {
    if (clienteId) {
      setSelectedClientes(new Set([clienteId]));
    }
    setIsDeleteModalOpen(true);
  };

  // Get selected cliente names for delete modal
  const getSelectedClienteNames = () => {
    return filteredClientes
      .filter(c => selectedClientes.has(c.id))
      .map(c => c.nome);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-cnd-blue-light/5 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          {/* Company Logo - Responsive */}
          <div className="mb-6 text-center">
            <div className="inline-block">
              <img 
                src="/lovable-uploads/81771d1f-07c7-41c6-aa45-297eeb71b860.png"
                alt="Logo da Empresa"
                className="h-16 w-auto md:h-20 lg:h-24 mx-auto mb-4 object-contain"
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2 flex items-center justify-center">
              <FileText className="w-8 h-8 mr-3" />
              Monitoramento de Certidões (CND)
            </h1>
            <p className="text-muted-foreground text-lg">
              Gerencie e monitore os clientes e suas certidões
            </p>
          </div>
        </div>

        {/* Filter and Actions Section */}
        <Card className="mb-6 shadow-lg border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-cnd-blue-medium/5">
            <CardTitle className="text-primary flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Filtros e Ações
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Nome do Contribuinte</label>
                <Input
                  placeholder="Buscar por nome..."
                  value={searchNome}
                  onChange={(e) => setSearchNome(e.target.value)}
                  className="focus:ring-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">CNPJ</label>
                <Input
                  placeholder="Buscar por CNPJ..."
                  value={searchCNPJ}
                  onChange={(e) => setSearchCNPJ(e.target.value)}
                  className="focus:ring-primary transition-all"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => setIsFormModalOpen(true)}
                  className="w-full bg-primary hover:bg-cnd-blue-medium transition-all shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Novo Cliente
                </Button>
              </div>
            </div>
            
            {/* Bulk Actions */}
            {selectedClientes.size > 0 && (
              <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3">
                <span className="text-sm text-primary font-medium">
                  {selectedClientes.size} cliente(s) selecionado(s)
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick()}
                  className="transition-all shadow-sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Selecionados
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-md border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Clientes</p>
                  <p className="text-3xl font-bold text-primary">{clientes.length}</p>
                </div>
                <Users className="w-8 h-8 text-cnd-blue-medium" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clientes Filtrados</p>
                  <p className="text-3xl font-bold text-primary">{filteredClientes.length}</p>
                </div>
                <Search className="w-8 h-8 text-cnd-blue-medium" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Selecionados</p>
                  <p className="text-3xl font-bold text-primary">{selectedClientes.size}</p>
                </div>
                <Checkbox className="w-8 h-8 border-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clientes Table */}
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-cnd-blue-medium/5">
            <CardTitle className="text-primary flex items-center justify-between">
              <span className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Lista de Clientes
              </span>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {filteredClientes.length} cliente(s)
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Carregando clientes...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 w-12">
                        <Checkbox
                          checked={filteredClientes.length > 0 && selectedClientes.size === filteredClientes.length}
                          onCheckedChange={handleSelectAll}
                          className="border-primary"
                        />
                      </th>
                      <th className="text-left p-4 text-primary font-semibold">Nome</th>
                      <th className="text-left p-4 text-primary font-semibold">E-mail</th>
                      <th className="text-left p-4 text-primary font-semibold">Telefone</th>
                      <th className="text-left p-4 text-primary font-semibold">CNPJ</th>
                      <th className="text-left p-4 text-primary font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClientes.map((cliente, index) => (
                      <tr 
                        key={cliente.id} 
                        className={`border-b transition-colors hover:bg-primary/2 ${
                          selectedClientes.has(cliente.id) ? 'bg-primary/5' : ''
                        }`}
                      >
                        <td className="p-4">
                          <Checkbox
                            checked={selectedClientes.has(cliente.id)}
                            onCheckedChange={(checked) => handleClienteSelect(cliente.id, checked as boolean)}
                            className="border-primary"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                              <span className="text-xs font-bold text-primary">
                                {cliente.nome.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium text-foreground">{cliente.nome}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-muted-foreground">
                            <Mail className="w-4 h-4 mr-2" />
                            {cliente.email}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-muted-foreground">
                            <Phone className="w-4 h-4 mr-2" />
                            {cliente.telefone}
                          </div>
                        </td>
                        <td className="p-4">
                          {cliente.cnpj ? (
                            <Badge variant="outline" className="text-xs">
                              {cliente.cnpj}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(cliente)}
                              className="hover:bg-primary hover:text-white transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(cliente.id)}
                              className="hover:bg-destructive hover:text-white transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredClientes.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {clientes.length === 0 
                        ? 'Nenhum cliente cadastrado ainda.' 
                        : 'Nenhum cliente encontrado com os filtros aplicados.'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <ClienteFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingCliente(null);
          }}
          onSubmit={handleFormSubmit}
          cliente={editingCliente}
          isLoading={formLoading}
          lastEmpresaId={lastEmpresaId}
          setLastEmpresaId={setLastEmpresaId}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteLoading}
          clienteNames={getSelectedClienteNames()}
          isMultiple={selectedClientes.size > 1}
        />
      </div>
    </div>
  );
};