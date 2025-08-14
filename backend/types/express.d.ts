import { JwtPayload } from 'jsonwebtoken';

// Este arquivo estende a definição de tipo original do Express
declare global {
  namespace Express {
    interface Request {
      // Adicionamos nossa propriedade 'user' ao objeto Request
      user?: JwtPayload & { id: string };
    }
  }
}