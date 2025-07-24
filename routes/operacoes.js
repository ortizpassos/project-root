import express from 'express';
import { autenticar, apenasAdmin } from '../middleware/auth.js';

const router = express.Router();

// Cadastrar operação
router.post('/cadastro/operacao', autenticar, apenasAdmin, async (req, res) => {
  const db = req.db;
  const { nome } = req.body;

  if (!nome) return res.status(400).json({ erro: 'Nome da operação é obrigatório' });

  const existe = db.data.operacoes.includes(nome);
  if (existe) return res.status(400).json({ erro: 'Operação já cadastrada' });

  db.data.operacoes.push(nome);
  await db.write();

  res.json({ mensagem: 'Operação cadastrada com sucesso' });
});

// Listar operações
router.get('/operacoes', autenticar, (req, res) => {
  const db = req.db;
  res.json(db.data.operacoes);
});

// Remover operação
router.delete('/operacao/:nome', autenticar, apenasAdmin, async (req, res) => {
  const db = req.db;
  const { nome } = req.params;

  const index = db.data.operacoes.indexOf(nome);
  if (index === -1) return res.status(404).json({ erro: 'Operação não encontrada' });

  db.data.operacoes.splice(index, 1);
  await db.write();

  res.json({ mensagem: 'Operação removida com sucesso' });
});

export default router;
