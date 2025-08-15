// backend/api/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config.js'; // Importa a configuração centralizada

const supabaseJwtSecret = config.supabaseJwtSecret!;

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, supabaseJwtSecret, (err, decoded) => {
        if (err) {
            console.error("Erro na verificação do token:", err);
            return res.sendStatus(403);
        }
        
        req.user = decoded as JwtPayload & { id: string };
        next();
    });
};