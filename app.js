import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { Low, JSONFile } from 'lowdb';

import { autenticar, apenasAdmin } from './middleware/auth.js';

import colaboradoresRoutes from './routes/colaboradores.js';
import operacoesRoutes from './routes/operacoes.js';
import gruposRoutes from './routes/grupos.js';
import metasRoutes from './routes/metas.js';
import contagensRoutes from './routes/contagens.js';
import backupRoutes from './routes/backup.js';
import authRoutes from './routes/auth.js';

const app = express(); // <-- Crie o app primeiro
const PORT = 3000;

const SECRET = 'eduardo'; // altere para sua chave segura

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Inicializa banco lowdb
const adapter = new JSONFile('db.json');
const db = new Low(adapter);

// Middleware para injetar db em req
app.use(async (req, res, next) => {
  await db.read();
  req.db = db;
  // Inicializa estrutura se estiver vazia
  db.data ||= {
    usuarios: [
      { id: 1, nome: 'admin', senha: '1234', permissao: 'admin' }
    ],
    colaboradores: [],
    operacoes: [],
    grupos: [],
    metas: [],
    contagens: []
  };
  await db.write();
  next();
});

// Rotas de autenticação — login e registro
app.use(authRoutes);

// Rota login para gerar token JWT (você pode mover essa rota para authRoutes para organizar melhor)
app.post('/auth/login', async (req, res) => {
  const { nome, senha } = req.body;
  if (!nome || !senha) return res.status(400).json({ erro: 'Nome e senha obrigatórios' });

  await db.read();
  const usuario = db.data.usuarios.find(u => u.nome === nome && u.senha === senha);
  if (!usuario) return res.status(401).json({ erro: 'Usuário ou senha inválidos' });

  const token = jwt.sign({ id: usuario.id, nome: usuario.nome, permissao: usuario.permissao }, SECRET, { expiresIn: '8h' });
  res.json({ token });
});

// Rotas protegidas
app.use(colaboradoresRoutes);
app.use(operacoesRoutes);
app.use(gruposRoutes);
app.use(metasRoutes);
app.use(contagensRoutes);
app.use(backupRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
