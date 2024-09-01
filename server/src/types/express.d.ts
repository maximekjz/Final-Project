import 'express';

declare global {
  namespace Express {
    interface Request {
      userid?: string;
      email?: string;
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