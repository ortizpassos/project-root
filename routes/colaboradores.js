import express from 'express';
import { autenticar, apenasAdmin } from '../middleware/auth.js';

const router = express.Router();

// Cadastro de colaborador
router.post('/cadastro/colaborador', autenticar, apenasAdmin, async (req, res) => {
  const db = req.db;
  const { nome, senha, grupo, operacao } = req.body;

  if (!nome || !senha || !grupo || !operacao) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  if (!/^\d{4}$/.test(senha)) {
    return res.status(400).json({ erro: 'Senha deve conter 4 dígitos numéricos' });
  }

  const jaExiste = db.data.colaboradores.find(c => c.nome === nome);
  if (jaExiste) {
    return res.status(400).json({ erro: 'Colaborador já cadastrado' });
  }

  const grupoExiste = db.data.grupos.includes(grupo);
  const operacaoExiste = db.data.operacoes.includes(operacao);

  if (!grupoExiste || !operacaoExiste) {
    return res.status(400).json({ erro: 'Grupo ou operação não cadastrados' });
  }

  db.data.colaboradores.push({ nome, senha, grupo, operacao });
  await db.write();

  res.json({ mensagem: 'Colaborador cadastrado com sucesso' });
});

// Listar colaboradores (sem senhas)
router.get('/colaboradores', autenticar, apenasAdmin, (req, res) => {
  const db = req.db;
  const colaboradores = db.data.colaboradores.map(({ nome, grupo, operacao }) => ({
    nome, grupo, operacao
  }));
  res.json(colaboradores);
});

// Remover colaborador
router.delete('/colaborador/:nome', autenticar, apenasAdmin, async (req, res) => {
  const db = req.db;
  const { nome } = req.params;

  const index = db.data.colaboradores.findIndex(c => c.nome === nome);
  if (index === -1) return res.status(404).json({ erro: 'Colaborador não encontrado' });

  db.data.colaboradores.splice(index, 1);
  await db.write();

  res.json({ mensagem: 'Colaborador removido com sucesso' });
});

export default router;
