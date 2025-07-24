# Frontend para Sistema de Gestão - Project Root

Este frontend foi desenvolvido para consumir a API do repositório `project-root`, fornecendo uma interface web moderna e responsiva para gerenciar colaboradores, operações e grupos.

## Funcionalidades Implementadas

### 1. Sistema de Autenticação
- **Login**: Interface de login com validação de credenciais
- **Gerenciamento de Sessão**: Uso de JWT (JSON Web Tokens) para manter a sessão do usuário
- **Logout**: Funcionalidade para encerrar a sessão
- **Persistência**: Token salvo no localStorage para manter login entre sessões

### 2. Dashboard Principal
- **Interface Responsiva**: Design adaptável para desktop e mobile
- **Navegação por Abas**: Sistema de navegação entre diferentes seções
- **Informações do Usuário**: Exibição do nome do usuário logado

### 3. Gestão de Colaboradores
- **Listagem**: Visualização de todos os colaboradores cadastrados
- **Cadastro**: Formulário para adicionar novos colaboradores
- **Validação**: Senha de 4 dígitos numéricos obrigatória
- **Remoção**: Funcionalidade para excluir colaboradores
- **Integração**: Seleção automática de grupos e operações disponíveis

### 4. Gestão de Operações
- **Listagem**: Visualização de todas as operações cadastradas
- **Cadastro**: Formulário para adicionar novas operações
- **Remoção**: Funcionalidade para excluir operações

### 5. Gestão de Grupos
- **Listagem**: Visualização de todos os grupos cadastrados
- **Cadastro**: Formulário para adicionar novos grupos
- **Remoção**: Funcionalidade para excluir grupos

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica da aplicação
- **CSS3**: Estilização moderna com gradientes, sombras e animações
- **JavaScript (ES6+)**: Lógica da aplicação e comunicação com a API
- **Fetch API**: Para requisições HTTP à API
- **LocalStorage**: Para persistência do token de autenticação

## Estrutura de Arquivos

```
frontend/
├── index.html          # Página principal com toda a estrutura HTML
├── styles.css          # Estilos CSS responsivos
└── script.js           # Lógica JavaScript da aplicação
```

## Design e UX

### Paleta de Cores
- **Primária**: Gradiente azul-roxo (#667eea → #764ba2)
- **Secundária**: Cinza (#6c757d)
- **Perigo**: Vermelho (#dc3545)
- **Fundo**: Cinza claro (#f5f5f5)

### Características do Design
- **Interface Limpa**: Design minimalista e profissional
- **Responsividade**: Adaptação automática para diferentes tamanhos de tela
- **Feedback Visual**: Animações e transições suaves
- **Acessibilidade**: Contraste adequado e navegação por teclado

## Funcionalidades de Segurança

- **Autenticação JWT**: Tokens seguros para autenticação
- **Validação de Entrada**: Validação no frontend e backend
- **Proteção de Rotas**: Verificação de autenticação antes de acessar funcionalidades
- **Logout Automático**: Limpeza de dados sensíveis ao fazer logout

## Como Usar

### 1. Credenciais de Teste
- **Usuário**: `teste`
- **Senha**: `1234`

### 2. Fluxo de Uso
1. Acesse a aplicação através do link fornecido
2. Faça login com as credenciais de teste
3. Navegue pelas diferentes seções usando as abas
4. Cadastre grupos e operações antes de cadastrar colaboradores
5. Use os botões "Adicionar" para criar novos registros
6. Use os botões "Remover" para excluir registros existentes

## Limitações e Melhorias Futuras

### Limitações Atuais
- **CORS**: Pode haver problemas de CORS dependendo da configuração do servidor
- **Validação**: Validação básica no frontend (recomenda-se validação robusta no backend)
- **Tratamento de Erros**: Tratamento básico de erros (pode ser expandido)

### Melhorias Sugeridas
- **Paginação**: Para listas com muitos itens
- **Busca e Filtros**: Funcionalidade de pesquisa
- **Edição**: Capacidade de editar registros existentes
- **Confirmações**: Modais de confirmação para ações destrutivas
- **Notificações**: Sistema de notificações toast
- **Validação Avançada**: Validação em tempo real nos formulários
- **Temas**: Suporte a temas claro/escuro
- **Internacionalização**: Suporte a múltiplos idiomas

## Problemas Conhecidos

1. **Autenticação**: Há uma inconsistência entre as rotas de login no `app.js` e `auth.js` que pode causar problemas de autenticação
2. **CORS**: Dependendo da configuração do servidor, pode ser necessário configurar CORS adequadamente
3. **Validação de Token**: O frontend não valida a expiração do token JWT

## Conclusão

Este frontend fornece uma interface completa e funcional para o sistema de gestão, implementando todas as principais funcionalidades da API de forma intuitiva e responsiva. A aplicação está pronta para uso e pode ser facilmente expandida com novas funcionalidades conforme necessário.

