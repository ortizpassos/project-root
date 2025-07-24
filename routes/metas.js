import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { apenasAdmin } from '../middleware/auth.js';

// Para __dirname no ESModules:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const dbPath = path.join(__dirname, '../db.json');

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

router.post('/colaborador/meta', apenasAdmin, (req, res) => {
  const { nome, meta } = req.body;

  if (!nome || typeof meta !== 'number') {
    return res.status(400).json({ erro: 'Nome e meta são obrigatórios.' });
  }

  const db = readDB();
  const colab = db.colaboradores.find(c => c.nome === nome);

  if (!colab) {
    return res.status(404).json({ erro: 'Colaborador não encontrado.' });
  }

  colab.meta = meta;
  writeDB(db);

  res.json({ mensagem: 'Meta atualizada com sucesso.', colaborador: colab });
});

router.delete('/colaborador/meta/:nome', apenasAdmin, (req, res) => {
  const { nome } = req.params;
  const db = readDB();
  const colab = db.colaboradores.find(c => c.nome === nome);

  if (!colab) {
    return res.status(404).json({ erro: 'Colaborador não encontrado.' });
  }

  delete colab.meta;
  writeDB(db);

  res.json({ mensagem: 'Meta removida com sucesso.', colaborador: colab });
});

router.get('/metas', (req, res) => {
  const db = readDB();
  const metas = db.colaboradores
    .filter(c => typeof c.meta !== 'undefined')
    .map(c => ({ nome: c.nome, meta: c.meta }));

  res.json(metas);
});

export default router;
