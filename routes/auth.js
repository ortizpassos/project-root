import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET = 'segredo_supersecreto'; // usar a mesma chave do middleware

router.post('/auth/register', async (req, res) => {
  const { username, password, role } = req.body;
  const db = req.db;

  if (!username || !password || !role) {
    return res.status(400).json({ erro: 'Usuário, senha e papel são obrigatórios' });
  }

  const existe = db.data.usuarios.find(u => u.username === username);
  if (existe) return res.status(400).json({ erro: 'Usuário já existe' });

  const passwordHash = await bcrypt.hash(password, 10);

  db.data.usuarios.push({ id: Date.now(), username, passwordHash, role });
  await db.write();

  res.json({ mensagem: 'Usuário cadastrado com sucesso' });
});

router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const db = req.db;

  const usuario = db.data.usuarios.find(u => u.username === username);
  if (!usuario) return res.status(401).json({ erro: 'Credenciais inválidas' });

  const ok = await bcrypt.compare(password, usuario.passwordHash);
  if (!ok) return res.status(401).json({ erro: 'Credenciais inválidas' });

  const token = jwt.sign({ username, role: usuario.role }, SECRET, { expiresIn: '1d' });
  res.json({ token });
});

export default router;
