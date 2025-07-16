// Cliente Form Modal - Create/Edit Cliente for CND System
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Save, X } from 'lucide-react';
import { Cliente, CreateClienteDto } from '@/types/cliente';

interface ClienteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cliente: CreateClienteDto) => Promise<void>;
  cliente?: Cliente | null;
  isLoading?: boolean;
}

const initialFormData: CreateClienteDto = {
  cnpj: '',
  periodicidade: 30,
  statusCliente: 'ativo',
  nacional: true,
  municipal: false,
  estadual: false,
  empresa: {
    idEmpresa: '',
    nomeEmpresa: '',
    cnpj: ''
  }
};

export const ClienteFormModal: React.FC<ClienteFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  cliente,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateClienteDto>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (cliente) {
        setFormData({
          cnpj: cliente.cnpj,
          periodicidade: cliente.periodicidade,
          statusCliente: cliente.statusCliente,
          nacional: cliente.nacional,
          municipal: cliente.municipal,
          estadual: cliente.estadual,
          empresa: {
            idEmpresa: cliente.empresa.idEmpresa,
            nomeEmpresa: cliente.empresa.nomeEmpresa,
            cnpj: cliente.empresa.cnpj,
          },
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [cliente, isOpen]);

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = numbers;
    if (numbers.length > 2) formatted = `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    if (numbers.length > 5) formatted = `${formatted.slice(0, 6)}.${numbers.slice(5)}`;
    if (numbers.length > 8) formatted = `${formatted.slice(0, 10)}/${numbers.slice(8)}`;
    if (numbers.length > 12) formatted = `${formatted.slice(0, 15)}-${numbers.slice(12)}`;
    return formatted.slice(0, 18);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

    if (!formData.cnpj.trim() || !cnpjRegex.test(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ do Cliente inválido. Use o formato XX.XXX.XXX/XXXX-XX.';
    }
    if (!formData.empresa.cnpj.trim() || !cnpjRegex.test(formData.empresa.cnpj)) {
      newErrors['empresa.cnpj'] = 'CNPJ da Empresa inválido. Use o formato XX.XXX.XXX/XXXX-XX.';
    }
    if (!formData.empresa.idEmpresa.trim()) {
      newErrors['empresa.idEmpresa'] = 'ID da Empresa é obrigatório.';
    }
    if (formData.empresa.idEmpresa.length > 6) {
        newErrors['empresa.idEmpresa'] = 'ID da Empresa não pode ter mais de 6 caracteres.';
    }
    if (!formData.empresa.nomeEmpresa.trim()) {
      newErrors['empresa.nomeEmpresa'] = 'Nome da Empresa é obrigatório.';
    }
    if (!formData.periodicidade || formData.periodicidade <= 0) {
      newErrors.periodicidade = 'Periodicidade deve ser um número positivo.';
    }
    if (!formData.statusCliente.trim()) {
      newErrors.statusCliente = 'Status do Cliente é obrigatório.';
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

  const handleInputChange = (field: string, value: string | number | boolean) => {
    const keys = field.split('.');
    if (keys.length > 1) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0] as keyof typeof prev],
          [keys[1]]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {cliente ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cliente CNPJ */}
          <div className="space-y-2">
            <Label htmlFor="cnpj" className="text-primary font-medium">CNPJ do Cliente *</Label>
            <Input id="cnpj" value={formData.cnpj} onChange={(e) => handleInputChange('cnpj', formatCNPJ(e.target.value))} placeholder="XX.XXX.XXX/XXXX-XX" className={errors.cnpj ? 'border-destructive' : ''} disabled={isLoading} />
            {errors.cnpj && <span className="text-xs text-destructive">{errors.cnpj}</span>}
          </div>

          {/* Empresa Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="empresa.idEmpresa" className="text-primary font-medium">ID da Empresa *</Label>
                <Input id="empresa.idEmpresa" value={formData.empresa.idEmpresa} onChange={(e) => handleInputChange('empresa.idEmpresa', e.target.value)} placeholder="Até 6 caracteres" className={errors['empresa.idEmpresa'] ? 'border-destructive' : ''} disabled={isLoading} maxLength={6}/>
                {errors['empresa.idEmpresa'] && <span className="text-xs text-destructive">{errors['empresa.idEmpresa']}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa.cnpj" className="text-primary font-medium">CNPJ da Empresa *</Label>
              <Input id="empresa.cnpj" value={formData.empresa.cnpj} onChange={(e) => handleInputChange('empresa.cnpj', formatCNPJ(e.target.value))} placeholder="XX.XXX.XXX/XXXX-XX" className={errors['empresa.cnpj'] ? 'border-destructive' : ''} disabled={isLoading} />
              {errors['empresa.cnpj'] && <span className="text-xs text-destructive">{errors['empresa.cnpj']}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="empresa.nomeEmpresa" className="text-primary font-medium">Nome da Empresa *</Label>
            <Input id="empresa.nomeEmpresa" value={formData.empresa.nomeEmpresa} onChange={(e) => handleInputChange('empresa.nomeEmpresa', e.target.value)} placeholder="Nome da Empresa" className={errors['empresa.nomeEmpresa'] ? 'border-destructive' : ''} disabled={isLoading} />
            {errors['empresa.nomeEmpresa'] && <span className="text-xs text-destructive">{errors['empresa.nomeEmpresa']}</span>}
          </div>

          {/* Other Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodicidade" className="text-primary font-medium">Periodicidade (dias) *</Label>
              <Input id="periodicidade" type="number" value={formData.periodicidade} onChange={(e) => handleInputChange('periodicidade', parseInt(e.target.value, 10) || 0)} placeholder="30" className={errors.periodicidade ? 'border-destructive' : ''} disabled={isLoading} />
              {errors.periodicidade && <span className="text-xs text-destructive">{errors.periodicidade}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="statusCliente" className="text-primary font-medium">Status do Cliente *</Label>
              <Input id="statusCliente" value={formData.statusCliente} onChange={(e) => handleInputChange('statusCliente', e.target.value)} placeholder="ativo" className={errors.statusCliente ? 'border-destructive' : ''} disabled={isLoading} />
              {errors.statusCliente && <span className="text-xs text-destructive">{errors.statusCliente}</span>}
            </div>
          </div>

          {/* CND Types */}
          <div className="space-y-2">
            <Label className="text-primary font-medium">Tipos de CND *</Label>
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="nacional" checked={formData.nacional} onCheckedChange={(checked) => handleInputChange('nacional', !!checked)} disabled={isLoading} />
                <Label htmlFor="nacional">Nacional</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="municipal" checked={formData.municipal} onCheckedChange={(checked) => handleInputChange('municipal', !!checked)} disabled={isLoading} />
                <Label htmlFor="municipal">Municipal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="estadual" checked={formData.estadual} onCheckedChange={(checked) => handleInputChange('estadual', !!checked)} disabled={isLoading} />
                <Label htmlFor="estadual">Estadual</Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}> <X className="w-4 h-4 mr-2" /> Cancelar </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-cnd-blue-medium">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {cliente ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};