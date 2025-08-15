import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config.js';

const supabaseJwtSecret = config.supabaseJwtSecret!;

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, supabaseJwtSecret, (err, decoded) => {
        if (err) {
            console.error("Erro na verificação do token:", err.message);
            return res.sendStatus(403); // Forbidden
        }

        // CORREÇÃO: O ID do usuário no JWT do Supabase vem no campo 'sub'.
        // Nós o lemos e o atribuímos ao campo 'id' do nosso objeto 'user'.
        const payload = decoded as JwtPayload;
        if (!payload.sub) {
            return res.status(403).json({ error: "Token inválido: ID de usuário ausente." });
        }

        req.user = { ...payload, id: payload.sub };
        
        next();
    });
};