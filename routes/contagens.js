import express from 'express';
import { autenticar, apenasAdmin } from '../middleware/auth.js';

const router = express.Router();

// Registrar contagem
router.post('/contagem', autenticar, async (req, res) => {
  const db = req.db;
  const { nome, senha, quantidade } = req.body;

  if (!nome || !senha || typeof quantidade !== 'number') {
    return res.status(400).json({ erro: 'Nome, senha e quantidade são obrigatórios' });
  }

  const colaborador = db.data.colaboradores.find(c => c.nome === nome && c.senha === senha);
  if (!colaborador) {
    return res.status(401).json({ erro: 'Colaborador ou senha inválidos' });
  }

  db.data.contagens.push({
    colaborador: nome,
    quantidade,
    grupo: colaborador.grupo,
    operacao: colaborador.operacao,
    timestamp: new Date().toISOString()
  });

  await db.write();

  res.json({ mensagem: 'Contagem registrada com sucesso' });
});

// Listar contagens com % da meta
router.get('/contagens', autenticar, (req, res) => {
  const db = req.db;

  const resultado = db.data.contagens.map(entry => {
    const meta = db.data.metas.find(m => m.colaborador === entry.colaborador);
    const porcentagem = meta
      ? Math.round((entry.quantidade / meta.valor) * 100)
      : null;

    return {
      colaborador: entry.colaborador,
      grupo: entry.grupo,
      operacao: entry.operacao,
      quantidade: entry.quantidade,
      porcentagem: porcentagem ?? 'Meta não definida',
      timestamp: entry.timestamp
    };
  });

  res.json(resultado);
});

// Remover contagens de colaborador
router.delete('/contagem/:nome', autenticar, apenasAdmin, async (req, res) => {
  const db = req.db;
  const { nome } = req.params;

  const antes = db.data.contagens.length;
  db.data.contagens = db.data.contagens.filter(c => c.colaborador !== nome);

  const removidos = antes - db.data.contagens.length;
  await db.write();

  res.json({ mensagem: `Removidas ${removidos} contagens de ${nome}` });
});

export default router;
