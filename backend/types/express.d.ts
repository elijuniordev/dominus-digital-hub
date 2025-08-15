import { JwtPayload } from 'jsonwebtoken';

// Define uma interface clara para o nosso usuário autenticado
interface UserPayload extends JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload;
    }
  }
}