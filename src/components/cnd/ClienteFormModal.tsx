// Cliente Form Modal - Create/Edit Cliente for CND System
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, X } from 'lucide-react';
import { Cliente, CreateClienteDto } from '@/types/cliente';

interface ClienteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cliente: CreateClienteDto) => Promise<void>;
  cliente?: Cliente | null;
  isLoading?: boolean;
}

export const ClienteFormModal: React.FC<ClienteFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  cliente,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CreateClienteDto>({
    nome: '',
    email: '',
    telefone: '',
    cnpj: '',
    periodicidade: 30,
    statusCliente: 'Ativo',
    nacional: true,
    municipal: false,
    estadual: false,
    empresa: {
      nomeEmpresa: '',
      cnpj: ''
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or cliente changes
  useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        cnpj: cliente.cnpj || ''
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cnpj: ''
      });
    }
    setErrors({});
  }, [cliente, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.empresa.nomeEmpresa.trim()) {
      newErrors['empresa.nomeEmpresa'] = 'Nome da empresa é obrigatório';
    }

    if (!formData.empresa.cnpj.trim()) {
      newErrors['empresa.cnpj'] = 'CNPJ da empresa é obrigatório';
    } else {
      const cnpjClean = formData.empresa.cnpj.replace(/\D/g, '');
      if (cnpjClean.length !== 14) {
        newErrors['empresa.cnpj'] = 'CNPJ da empresa deve ter 14 dígitos';
      }
    }

    if (!formData.periodicidade) {
      newErrors.periodicidade = 'Periodicidade é obrigatória';
    }

    if (!formData.statusCliente.trim()) {
      newErrors.statusCliente = 'Status é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const { nome, email, telefone, ...rest } = formData;

    const clienteParaEnviar = {
      ...rest,
      empresa: {
        nomeEmpresa: formData.empresa.nomeEmpresa,
        cnpj: formData.empresa.cnpj
      }
    };

    try {
      await onSubmit(clienteParaEnviar);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChange = (field: keyof CreateClienteDto | 'empresa.nomeEmpresa' | 'empresa.cnpj', value: string | boolean) => {
    if (field.startsWith('empresa.')) {
      const empresaField = field.split('.')[1] as keyof CreateClienteDto['empresa'];
      setFormData(prev => ({
        ...prev,
        empresa: {
          ...prev.empresa,
          [empresaField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {cliente ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-primary font-medium">
              Nome do Contribuinte *
            </Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Digite o nome completo"
              className={`transition-all ${errors.nome ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary'}`}
              disabled={isLoading}
            />
            {errors.nome && (
              <span className="text-xs text-destructive">{errors.nome}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary font-medium">
              E-mail *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="exemplo@empresa.com"
              className={`transition-all ${errors.email ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary'}`}
              disabled={isLoading}
            />
            {errors.email && (
              <span className="text-xs text-destructive">{errors.email}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone" className="text-primary font-medium">
              Telefone *
            </Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => handleInputChange('telefone', formatPhone(e.target.value))}
              placeholder="(11) 99999-9999"
              className={`transition-all ${errors.telefone ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary'}`}
              disabled={isLoading}
            />
            {errors.telefone && (
              <span className="text-xs text-destructive">{errors.telefone}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="empresa.nomeEmpresa" className="text-primary font-medium">
              Nome da Empresa *
            </Label>
            <Input
              id="empresa.nomeEmpresa"
              value={formData.empresa.nomeEmpresa}
              onChange={(e) => handleInputChange('empresa.nomeEmpresa', e.target.value)}
              placeholder="Digite o nome da empresa"
              className={`transition-all ${errors['empresa.nomeEmpresa'] ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary'}`}
              disabled={isLoading}
            />
            {errors['empresa.nomeEmpresa'] && (
              <span className="text-xs text-destructive">{errors['empresa.nomeEmpresa']}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="empresa.cnpj" className="text-primary font-medium">
              CNPJ da Empresa *
            </Label>
            <Input
              id="empresa.cnpj"
              value={formData.empresa.cnpj}
              onChange={(e) => handleInputChange('empresa.cnpj', formatCNPJ(e.target.value))}
              placeholder="00.000.000/0000-00"
              className={`transition-all ${errors['empresa.cnpj'] ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary'}`}
              disabled={isLoading}
            />
            {errors['empresa.cnpj'] && (
              <span className="text-xs text-destructive">{errors['empresa.cnpj']}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodicidade" className="text-primary font-medium">
              Periodicidade (dias) *
            </Label>
            <Input
              id="periodicidade"
              type="number"
              value={formData.periodicidade}
              onChange={(e) => handleInputChange('periodicidade', e.target.value)}
              placeholder="30"
              className={`transition-all ${errors.periodicidade ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary'}`}
              disabled={isLoading}
            />
            {errors.periodicidade && (
              <span className="text-xs text-destructive">{errors.periodicidade}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="statusCliente" className="text-primary font-medium">
              Status *
            </Label>
            <select
              id="statusCliente"
              value={formData.statusCliente}
              onChange={(e) => handleInputChange('statusCliente', e.target.value)}
              className={`transition-all w-full p-2 border rounded ${errors.statusCliente ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary'}`}
              disabled={isLoading}
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Pendente">Pendente</option>
            </select>
            {errors.statusCliente && (
              <span className="text-xs text-destructive">{errors.statusCliente}</span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="nacional"
                checked={formData.nacional}
                onChange={(e) => handleInputChange('nacional', e.target.checked)}
                className="h-4 w-4"
                disabled={isLoading}
              />
              <Label htmlFor="nacional">Nacional</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="municipal"
                checked={formData.municipal}
                onChange={(e) => handleInputChange('municipal', e.target.checked)}
                className="h-4 w-4"
                disabled={isLoading}
              />
              <Label htmlFor="municipal">Municipal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="estadual"
                checked={formData.estadual}
                onChange={(e) => handleInputChange('estadual', e.target.checked)}
                className="h-4 w-4"
                disabled={isLoading}
              />
              <Label htmlFor="estadual">Estadual</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="transition-all hover:bg-muted"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-cnd-blue-medium transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {cliente ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};