import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;

if (!supabaseJwtSecret) {
    throw new Error('A SUPABASE_JWT_SECRET não está definida no .env do backend.');
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, supabaseJwtSecret, (err, decoded) => {
        if (err) {
            console.error("Erro na verificação do token:", err);
            return res.sendStatus(403); // Forbidden
        }
        
        // O bloco namespace foi removido daqui. O TypeScript agora entende req.user globalmente.
        req.user = decoded as JwtPayload & { id: string };
        next();
    });
};