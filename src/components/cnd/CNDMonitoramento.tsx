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
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Cliente, CreateClienteDto } from '@/types/cliente';
import { clienteService } from '@/services/clienteService';
import { ClienteFormModal } from './ClienteFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const CNDMonitoramento: React.FC = () => {
  // State management
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmpresa, setSearchEmpresa] = useState('');
  const [searchCNPJ, setSearchCNPJ] = useState('');
  const [selectedClientes, setSelectedClientes] = useState<Set<number>>(new Set());
  
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
        description: "Não foi possível carregar a lista de clientes. Verifique a conexão com a API.",
        variant: "destructive",
      });
      setClientes([]); // Start with an empty list on error
    } finally {
      setLoading(false);
    }
  };

  // Filtered clientes based on search
  const filteredClientes = useMemo(() => {
    return clientes.filter(cliente => {
      const matchesEmpresa = cliente.empresa.nomeEmpresa.toLowerCase().includes(searchEmpresa.toLowerCase());
      const matchesCNPJ = !searchCNPJ || cliente.cnpj.includes(searchCNPJ);
      return matchesEmpresa && matchesCNPJ;
    });
  }, [clientes, searchEmpresa, searchCNPJ]);

  // Handle form submission (create/update)
  const handleFormSubmit = async (formData: CreateClienteDto) => {
    try {
      setFormLoading(true);
      
      if (editingCliente) {
        // Update existing cliente
        await clienteService.updateCliente(editingCliente.id, formData);
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
    } catch (error: any) {
      toast({
        title: "Erro ao salvar cliente",
        description: error.message || "Não foi possível salvar os dados do cliente.",
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
      const idsToDelete = Array.from(selectedClientes);
      
      if (idsToDelete.length > 1) {
        // Bulk delete
        await clienteService.deleteMultipleClientes(idsToDelete);
        toast({
          title: "Clientes excluídos",
          description: `${idsToDelete.length} cliente(s) foram excluídos com sucesso.`,
        });
      } else {
        // Single delete
        await clienteService.deleteCliente(idsToDelete[0]);
        toast({
          title: "Cliente excluído",
          description: "O cliente foi excluído com sucesso.",
        });
      }
      
      await loadClientes();
      setSelectedClientes(new Set());
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro ao excluir cliente(s)",
        description: error.message || "Não foi possível excluir o(s) cliente(s) selecionado(s).",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleClienteSelect = (clienteId: number, checked: boolean) => {
    const newSelected = new Set(selectedClientes);
    if (checked) newSelected.add(clienteId);
    else newSelected.delete(clienteId);
    setSelectedClientes(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedClientes(checked ? new Set(filteredClientes.map(c => c.id)) : new Set());
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (clienteId?: number) => {
    if (clienteId) {
      setSelectedClientes(new Set([clienteId]));
    }
    setIsDeleteModalOpen(true);
  };

  const getSelectedClienteNames = () => {
    return filteredClientes
      .filter(c => selectedClientes.has(c.id))
      .map(c => `${c.empresa.nomeEmpresa} (${c.cnpj})`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-cnd-blue-light/5 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="mb-6 text-center">
            <div className="inline-block">
              <img src="/lovable-uploads/81771d1f-07c7-41c6-aa45-297eeb71b860.png" alt="Logo da Empresa" className="h-16 w-auto md:h-20 lg:h-24 mx-auto mb-4 object-contain" />
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
                <label className="text-sm font-medium text-primary">Nome da Empresa</label>
                <Input placeholder="Buscar por nome da empresa..." value={searchEmpresa} onChange={(e) => setSearchEmpresa(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">CNPJ do Cliente</label>
                <Input placeholder="Buscar por CNPJ do cliente..." value={searchCNPJ} onChange={(e) => setSearchCNPJ(e.target.value)} />
              </div>
              <div className="flex items-end">
                <Button onClick={() => { setEditingCliente(null); setIsFormModalOpen(true); }} className="w-full bg-primary hover:bg-cnd-blue-medium transition-all shadow-md">
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Novo Cliente
                </Button>
              </div>
            </div>
            
            {selectedClientes.size > 0 && (
              <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3">
                <span className="text-sm text-primary font-medium">{selectedClientes.size} cliente(s) selecionado(s)</span>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick()} className="transition-all shadow-sm">
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
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Clientes</p>
                <p className="text-3xl font-bold text-primary">{clientes.length}</p>
              </div>
              <Users className="w-8 h-8 text-cnd-blue-medium" />
            </CardContent>
          </Card>
          <Card className="shadow-md border-primary/10">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clientes Filtrados</p>
                <p className="text-3xl font-bold text-primary">{filteredClientes.length}</p>
              </div>
              <Search className="w-8 h-8 text-cnd-blue-medium" />
            </CardContent>
          </Card>
          <Card className="shadow-md border-primary/10">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Selecionados</p>
                <p className="text-3xl font-bold text-primary">{selectedClientes.size}</p>
              </div>
              <Checkbox className="w-8 h-8 border-primary" />
            </CardContent>
          </Card>
        </div>

        {/* Clientes Table */}
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-cnd-blue-medium/5">
            <CardTitle className="text-primary flex items-center justify-between">
              <span className="flex items-center"><Users className="w-5 h-5 mr-2" /> Lista de Clientes</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary">{filteredClientes.length} cliente(s)</Badge>
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
                      <th className="text-left p-4 w-12"><Checkbox checked={filteredClientes.length > 0 && selectedClientes.size === filteredClientes.length} onCheckedChange={handleSelectAll} /></th>
                      <th className="text-left p-4 text-primary font-semibold">Nome da Empresa</th>
                      <th className="text-left p-4 text-primary font-semibold">CNPJ do Cliente</th>
                      <th className="text-left p-4 text-primary font-semibold">Status</th>
                      <th className="text-left p-4 text-primary font-semibold">Tipos de CND</th>
                      <th className="text-left p-4 text-primary font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClientes.map(cliente => (
                      <tr key={cliente.id} className={`border-b transition-colors hover:bg-primary/5 ${selectedClientes.has(cliente.id) ? 'bg-primary/10' : ''}`}>
                        <td className="p-4"><Checkbox checked={selectedClientes.has(cliente.id)} onCheckedChange={(checked) => handleClienteSelect(cliente.id, !!checked)} /></td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3"><Building2 className="w-4 h-4 text-primary"/></div>
                            <span className="font-medium text-foreground">{cliente.empresa.nomeEmpresa}</span>
                          </div>
                        </td>
                        <td className="p-4"><Badge variant="outline">{cliente.cnpj}</Badge></td>
                        <td className="p-4">
                          <Badge variant={cliente.statusCliente.toLowerCase() === 'ativo' ? 'default' : 'secondary'}>
                            {cliente.statusCliente.charAt(0).toUpperCase() + cliente.statusCliente.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {cliente.nacional && <Badge variant="outline" className="flex items-center"><CheckCircle className="w-3 h-3 mr-1 text-green-500"/>N</Badge>}
                            {cliente.municipal && <Badge variant="outline" className="flex items-center"><CheckCircle className="w-3 h-3 mr-1 text-green-500"/>M</Badge>}
                            {cliente.estadual && <Badge variant="outline" className="flex items-center"><CheckCircle className="w-3 h-3 mr-1 text-green-500"/>E</Badge>}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(cliente)}><Edit className="w-4 h-4" /></Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteClick(cliente.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredClientes.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{clientes.length === 0 ? 'Nenhum cliente cadastrado ainda.' : 'Nenhum cliente encontrado com os filtros aplicados.'}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <ClienteFormModal
          isOpen={isFormModalOpen}
          onClose={() => { setIsFormModalOpen(false); setEditingCliente(null); }}
          onSubmit={handleFormSubmit}
          cliente={editingCliente}
          isLoading={formLoading}
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