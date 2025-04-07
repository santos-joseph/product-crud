import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret';

export const authController = {
  async generateApiKey(req: Request, res: Response) {
    try {
      const apiKey = jwt.sign({}, JWT_SECRET, {
        expiresIn: '30d'
      });

      return res.json({ apiKey });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao gerar API Key' });
    }
  }
};