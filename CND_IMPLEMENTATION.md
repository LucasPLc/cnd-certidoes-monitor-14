# Sistema de Monitoramento de Certidões (CND) - Documentação

## Visão Geral
Sistema completo e responsivo para monitoramento de certidões CND com foco em gerenciamento de clientes.

## 🎨 Design System

### Cores Principais
- **Azul Escuro**: `#35518a` (--cnd-blue-dark)
- **Azul Médio**: `#3d68a6` (--cnd-blue-medium) 
- **Azul Claro**: Gerado automaticamente para backgrounds

### Implementação das Cores
As cores estão implementadas no sistema de design através de:
- `src/index.css` - Tokens CSS customizados
- `src/tailwind.config.ts` - Configuração do Tailwind

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   ├── cnd/
│   │   ├── CNDMonitoramento.tsx      # Componente principal
│   │   ├── ClienteFormModal.tsx      # Modal de cadastro/edição
│   │   └── DeleteConfirmModal.tsx    # Modal de confirmação de exclusão
│   └── ui/                           # Componentes shadcn customizados
├── services/
│   └── clienteService.ts            # Serviço para API calls
├── types/
│   └── cliente.ts                   # Interfaces TypeScript
└── pages/
    └── Index.tsx                    # Página principal
```

## 🔧 Funcionalidades Implementadas

### ✅ CRUD Completo de Clientes
- **Listar**: `GET /clientes`
- **Buscar por ID**: `GET /clientes/{clienteId}`
- **Criar**: `POST /clientes`
- **Atualizar**: `PUT /clientes/{clienteId}`
- **Excluir**: `DELETE /clientes/{clienteId}`
- **Exclusão em massa**: Múltiplos clientes

### ✅ Interface de Usuário
- **Filtros de busca**: Nome e CNPJ
- **Seleção múltipla**: Checkboxes com "Selecionar Todos"
- **Tabela responsiva**: Adaptável a diferentes tamanhos de tela
- **Modais intuitivos**: Formulários e confirmações
- **Feedback visual**: Toasts de sucesso/erro
- **Loading states**: Spinners durante operações assíncronas

### ✅ Validações
- **Cliente Form**: Validação de e-mail, telefone e CNPJ
- **Formatação automática**: CNPJ e telefone
- **Campos obrigatórios**: Nome, e-mail e telefone

## 🎯 Endpoints da API

### Cliente Service
```typescript
// Todos os métodos estão preparados para integração
class ClienteService {
  getAllClientes(): Promise<Cliente[]>
  getClienteById(id: number): Promise<Cliente>
  createCliente(data: CreateClienteDto): Promise<Cliente>
  updateCliente(id: number, data: UpdateClienteDto): Promise<Cliente>
  deleteCliente(id: number): Promise<void>
  deleteMultipleClientes(ids: number[]): Promise<void>
}
```

## 🎨 Customização

### Logo da Empresa
```tsx
// Localização: src/components/cnd/CNDMonitoramento.tsx (linha ~120)
{/* Company Logo Placeholder - Replace with actual logo */}
<div className="mb-6 text-center">
  <div className="inline-block bg-gradient-to-r from-primary to-primary-variant text-white p-4 rounded-lg shadow-lg">
    <Building2 className="w-8 h-8 mx-auto mb-2" />
    <span className="text-sm font-medium">LOGO DA EMPRESA</span>
  </div>
</div>
```

### Configuração da API
```typescript
// Localização: src/services/clienteService.ts (linha 4)
// NOTE: Replace BASE_URL with your actual API endpoint
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
```

### Cores Personalizadas
```css
/* src/index.css */
--cnd-blue-dark: 215 46% 38%;    /* #35518a */
--cnd-blue-medium: 218 45% 44%;  /* #3d68a6 */
--cnd-blue-light: 218 45% 94%;   /* Variante clara */
```

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Adaptações Mobile
- Grid responsivo (1 coluna em mobile, 3 em desktop)
- Tabela com scroll horizontal
- Botões com tamanhos adequados para touch
- Espaçamentos otimizados

## 🚀 Próximas Funcionalidades (Preparadas)

### Estrutura Expandível
- Componentes modulares para facilitar adição de funcionalidades
- Separação clara entre lógica de negócio e UI
- Hooks personalizados prontos para implementação

### Funcionalidades de Certidões
- Base preparada para adicionar monitoramento de certidões
- Estrutura de dados extensível
- Interface adaptável para novos módulos

## 🔒 Segurança e Boas Práticas

### Implementadas
- Validação de entrada nos formulários
- Sanitização de dados antes do envio
- Tratamento de erros com feedback ao usuário
- Loading states para prevenir ações duplas

### Preparadas para Backend
- Headers de autenticação prontos
- Interceptors para tokens
- Tratamento de erros HTTP

## 📋 Lista de Dependências

### Principais
- React 18+ com TypeScript
- Tailwind CSS para estilização
- Shadcn/ui para componentes base
- Lucide React para ícones
- React Hook Form para formulários

### Utilitárias
- class-variance-authority para variantes de componentes
- clsx e tailwind-merge para classes condicionais

## 🐛 Debug e Desenvolvimento

### Mock Data
O sistema inclui dados de teste quando a API não está disponível:
```typescript
// Localização: src/components/cnd/CNDMonitoramento.tsx (linha ~58)
setClientes([
  { id: 1, nome: "Empresa ABC Ltda", email: "contato@empresaabc.com", ... },
  { id: 2, nome: "Comércio XYZ S.A.", email: "admin@comercioxyz.com", ... },
]);
```

### Console Logs
Todos os erros são logados no console para facilitar debug durante desenvolvimento.

## 📞 Suporte

### Pontos de Customização Comentados
- Logo da empresa (linha 120 do componente principal)
- URL da API (linha 4 do serviço)
- Cores do sistema (index.css)
- Mock data (linha 58 do componente principal)

### Arquitetura
- Componentes separados por responsabilidade
- Serviços isolados para API calls
- Types TypeScript para type safety
- Design system centralizado