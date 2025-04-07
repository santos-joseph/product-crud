import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers.authorization?.replace('ApiKey ', '');

  if (!apiKey) {
    return res.status(401).json({ error: 'API Key não fornecida' });
  }

  try {
    jwt.verify(apiKey, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'API Key inválida' });
  }
};