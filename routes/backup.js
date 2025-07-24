import express from 'express';
import path from 'path';
import fs from 'fs';
import { apenasAdmin } from '../middleware/auth.js';
import { fileURLToPath } from 'url';

// Ajuste __dirname para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const dbPath = path.join(__dirname, '../db.json');

router.get('/exportar', apenasAdmin, (req, res) => {
  if (!fs.existsSync(dbPath)) {
    return res.status(404).json({ erro: 'Arquivo de banco de dados não encontrado.' });
  }

  res.download(dbPath, 'backup-db.json', err => {
    if (err) {
      console.error('Erro ao enviar arquivo:', err);
      res.status(500).json({ erro: 'Erro ao exportar backup.' });
    }
  });
});

export default router;
