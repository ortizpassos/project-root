// Configuração da API
const API_BASE_URL = 'http://localhost:3000';

// Estado da aplicação
let currentUser = null;
let authToken = null;

// Elementos DOM
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const userNameSpan = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se há token salvo
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showLogin();
    }

    // Event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Login
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    // Navegação
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            showSection(section);
        });
    });

    // Modais
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });

    // Botões de ação
    document.getElementById('add-colaborador-btn').addEventListener('click', () => openModal('colaborador-modal'));
    document.getElementById('add-operacao-btn').addEventListener('click', () => openModal('operacao-modal'));
    document.getElementById('add-grupo-btn').addEventListener('click', () => openModal('grupo-modal'));

    // Formulários
    document.getElementById('colaborador-form').addEventListener('submit', handleColaboradorSubmit);
    document.getElementById('operacao-form').addEventListener('submit', handleOperacaoSubmit);
    document.getElementById('grupo-form').addEventListener('submit', handleGrupoSubmit);
}

// Funções de autenticação
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = { username };
            
            // Salvar no localStorage
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showDashboard();
        } else {
            showError(data.erro || 'Erro ao fazer login');
        }
    } catch (error) {
        showError('Erro de conexão com o servidor');
        console.error('Erro:', error);
    }
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    showLogin();
}

// Funções de navegação
function showLogin() {
    loginScreen.classList.add('active');
    dashboardScreen.classList.remove('active');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    hideError();
}

function showDashboard() {
    loginScreen.classList.remove('active');
    dashboardScreen.classList.add('active');
    userNameSpan.textContent = currentUser.username;
    
    // Carregar dados iniciais
    loadColaboradores();
    loadOperacoes();
    loadGrupos();
}

function showSection(sectionName) {
    // Atualizar navegação
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Mostrar seção
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionName}-section`).classList.add('active');

    // Carregar dados da seção
    switch(sectionName) {
        case 'colaboradores':
            loadColaboradores();
            break;
        case 'operacoes':
            loadOperacoes();
            break;
        case 'grupos':
            loadGrupos();
            break;
    }
}

// Funções de API
async function apiRequest(endpoint, options = {}) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        ...options
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro na requisição');
        }

        return data;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

// Funções de Colaboradores
async function loadColaboradores() {
    try {
        const colaboradores = await apiRequest('/colaboradores');
        renderColaboradores(colaboradores);
    } catch (error) {
        console.error('Erro ao carregar colaboradores:', error);
    }
}

function renderColaboradores(colaboradores) {
    const tbody = document.querySelector('#colaboradores-table tbody');
    tbody.innerHTML = '';

    colaboradores.forEach(colaborador => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${colaborador.nome}</td>
            <td>${colaborador.grupo}</td>
            <td>${colaborador.operacao}</td>
            <td>
                <button class="btn-danger" onclick="deleteColaborador('${colaborador.nome}')">
                    Remover
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function handleColaboradorSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const colaborador = {
        nome: formData.get('nome'),
        senha: formData.get('senha'),
        grupo: formData.get('grupo'),
        operacao: formData.get('operacao')
    };

    try {
        await apiRequest('/cadastro/colaborador', {
            method: 'POST',
            body: JSON.stringify(colaborador)
        });

        closeModal('colaborador-modal');
        loadColaboradores();
        e.target.reset();
    } catch (error) {
        alert('Erro ao cadastrar colaborador: ' + error.message);
    }
}

async function deleteColaborador(nome) {
    if (confirm(`Tem certeza que deseja remover o colaborador ${nome}?`)) {
        try {
            await apiRequest(`/colaborador/${nome}`, {
                method: 'DELETE'
            });
            loadColaboradores();
        } catch (error) {
            alert('Erro ao remover colaborador: ' + error.message);
        }
    }
}

// Funções de Operações
async function loadOperacoes() {
    try {
        const operacoes = await apiRequest('/operacoes');
        renderOperacoes(operacoes);
        updateOperacoesSelect(operacoes);
    } catch (error) {
        console.error('Erro ao carregar operações:', error);
    }
}

function renderOperacoes(operacoes) {
    const tbody = document.querySelector('#operacoes-table tbody');
    tbody.innerHTML = '';

    operacoes.forEach(operacao => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${operacao}</td>
            <td>
                <button class="btn-danger" onclick="deleteOperacao('${operacao}')">
                    Remover
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateOperacoesSelect(operacoes) {
    const select = document.getElementById('colaborador-operacao');
    select.innerHTML = '<option value="">Selecione uma operação</option>';
    
    operacoes.forEach(operacao => {
        const option = document.createElement('option');
        option.value = operacao;
        option.textContent = operacao;
        select.appendChild(option);
    });
}

async function handleOperacaoSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const operacao = {
        nome: formData.get('nome')
    };

    try {
        await apiRequest('/cadastro/operacao', {
            method: 'POST',
            body: JSON.stringify(operacao)
        });

        closeModal('operacao-modal');
        loadOperacoes();
        e.target.reset();
    } catch (error) {
        alert('Erro ao cadastrar operação: ' + error.message);
    }
}

async function deleteOperacao(nome) {
    if (confirm(`Tem certeza que deseja remover a operação ${nome}?`)) {
        try {
            await apiRequest(`/operacao/${nome}`, {
                method: 'DELETE'
            });
            loadOperacoes();
        } catch (error) {
            alert('Erro ao remover operação: ' + error.message);
        }
    }
}

// Funções de Grupos
async function loadGrupos() {
    try {
        const grupos = await apiRequest('/grupos');
        renderGrupos(grupos);
        updateGruposSelect(grupos);
    } catch (error) {
        console.error('Erro ao carregar grupos:', error);
    }
}

function renderGrupos(grupos) {
    const tbody = document.querySelector('#grupos-table tbody');
    tbody.innerHTML = '';

    grupos.forEach(grupo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${grupo}</td>
            <td>
                <button class="btn-danger" onclick="deleteGrupo('${grupo}')">
                    Remover
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateGruposSelect(grupos) {
    const select = document.getElementById('colaborador-grupo');
    select.innerHTML = '<option value="">Selecione um grupo</option>';
    
    grupos.forEach(grupo => {
        const option = document.createElement('option');
        option.value = grupo;
        option.textContent = grupo;
        select.appendChild(option);
    });
}

async function handleGrupoSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const grupo = {
        nome: formData.get('nome')
    };

    try {
        await apiRequest('/cadastro/grupo', {
            method: 'POST',
            body: JSON.stringify(grupo)
        });

        closeModal('grupo-modal');
        loadGrupos();
        e.target.reset();
    } catch (error) {
        alert('Erro ao cadastrar grupo: ' + error.message);
    }
}

async function deleteGrupo(nome) {
    if (confirm(`Tem certeza que deseja remover o grupo ${nome}?`)) {
        try {
            await apiRequest(`/grupo/${nome}`, {
                method: 'DELETE'
            });
            loadGrupos();
        } catch (error) {
            alert('Erro ao remover grupo: ' + error.message);
        }
    }
}

// Funções de Modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    
    // Se for modal de colaborador, carregar grupos e operações
    if (modalId === 'colaborador-modal') {
        loadGrupos();
        loadOperacoes();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    
    // Limpar formulário
    const form = modal.querySelector('form');
    if (form) {
        form.reset();
    }
}

// Funções de utilidade
function showError(message) {
    loginError.textContent = message;
    loginError.classList.add('show');
}

function hideError() {
    loginError.classList.remove('show');
}

// Fechar modal ao clicar fora
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

