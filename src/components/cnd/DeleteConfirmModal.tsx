// Delete Confirmation Modal - CND System
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
  clienteNames: string[];
  isMultiple?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  clienteNames,
  isMultiple = false
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            <DialogTitle className="text-destructive">
              Confirmar Exclusão
            </DialogTitle>
          </div>
          <DialogDescription className="text-left mt-4">
            {isMultiple ? (
              <>
                <p className="mb-3">
                  Você está prestes a excluir <strong>{clienteNames.length}</strong> cliente(s):
                </p>
                <div className="bg-muted rounded-md p-3 max-h-32 overflow-y-auto">
                  <ul className="space-y-1">
                    {clienteNames.map((name, index) => (
                      <li key={index} className="text-sm text-foreground">
                        • {name}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-3 text-destructive font-medium">
                  Esta ação não pode ser desfeita!
                </p>
              </>
            ) : (
              <>
                <p className="mb-3">
                  Você está prestes a excluir o cliente:
                </p>
                <div className="bg-muted rounded-md p-3">
                  <p className="font-medium text-foreground">{clienteNames[0]}</p>
                </div>
                <p className="mt-3 text-destructive font-medium">
                  Esta ação não pode ser desfeita!
                </p>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

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
            onClick={handleConfirm}
            disabled={isLoading}
            variant="destructive"
            className="transition-all hover:bg-destructive/90"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {isMultiple ? `Excluir ${clienteNames.length} Cliente(s)` : 'Excluir Cliente'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};