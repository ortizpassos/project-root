import express from 'express';
import { autenticar, apenasAdmin } from '../middleware/auth.js';

const router = express.Router();

// Cadastrar grupo
router.post('/cadastro/grupo', autenticar, apenasAdmin, async (req, res) => {
  const db = req.db;
  const { nome } = req.body;

  if (!nome) return res.status(400).json({ erro: 'Nome do grupo é obrigatório' });

  const existe = db.data.grupos.includes(nome);
  if (existe) return res.status(400).json({ erro: 'Grupo já cadastrado' });

  db.data.grupos.push(nome);
  await db.write();

  res.json({ mensagem: 'Grupo cadastrado com sucesso' });
});

// Listar grupos
router.get('/grupos', autenticar, (req, res) => {
  const db = req.db;
  res.json(db.data.grupos);
});

// Remover grupo
router.delete('/grupo/:nome', autenticar, apenasAdmin, async (req, res) => {
  const db = req.db;
  const { nome } = req.params;

  const index = db.data.grupos.indexOf(nome);
  if (index === -1) return res.status(404).json({ erro: 'Grupo não encontrado' });

  db.data.grupos.splice(index, 1);
  await db.write();

  res.json({ mensagem: 'Grupo removido com sucesso' });
});

export default router;
