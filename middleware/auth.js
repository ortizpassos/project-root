// middleware/auth.js
import jwt from 'jsonwebtoken';

const SECRET = 'segredo_supersecreto'; // MESMO segredo do auth.js

// Middleware para autenticar o token JWT
export function autenticar(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ erro: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token mal formatado' });

  jwt.verify(token, SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ erro: 'Token inválido' });
    req.usuario = usuario; // usuário decodificado (username, role)
    next();
  });
}

// Middleware para liberar só admins
export function apenasAdmin(req, res, next) {
  if (!req.usuario) return res.status(401).json({ erro: 'Usuário não autenticado' });

  if (req.usuario.role !== 'admin') {
    return res.status(403).json({ erro: 'Acesso negado: apenas admin' });
  }

  next();
}
