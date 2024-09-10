import 'express';
import { JwtPayload } from 'jsonwebtoken';

// Définir l'interface pour le token décodé
interface DecodedToken extends JwtPayload {
  userid: number; 
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      userid?: string;
      email?: string;
      user?: DecodedToken; 
    }
  }
}

declare module 'jsonwebtoken' {
  export class JsonWebTokenError extends Error {
    name: 'JsonWebTokenError';
    message: string;
    constructor(message: string);
  }
}
