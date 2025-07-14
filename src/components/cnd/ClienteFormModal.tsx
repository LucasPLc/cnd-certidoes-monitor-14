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
    cnpj: ''
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

    // CNPJ validation (basic format check)
    if (formData.cnpj && formData.cnpj.length > 0) {
      const cnpjClean = formData.cnpj.replace(/\D/g, '');
      if (cnpjClean.length !== 14) {
        newErrors.cnpj = 'CNPJ deve ter 14 dígitos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChange = (field: keyof CreateClienteDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
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
            <Label htmlFor="cnpj" className="text-primary font-medium">
              CNPJ
            </Label>
            <Input
              id="cnpj"
              value={formData.cnpj}
              onChange={(e) => handleInputChange('cnpj', formatCNPJ(e.target.value))}
              placeholder="00.000.000/0000-00"
              className={`transition-all ${errors.cnpj ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary'}`}
              disabled={isLoading}
            />
            {errors.cnpj && (
              <span className="text-xs text-destructive">{errors.cnpj}</span>
            )}
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