import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface DecodedToken extends JwtPayload {
  userid: string;
  email: string;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const accessToken = req.cookies.token || req.headers['x-access-token'] as string;

  console.log('Access token:', accessToken);

  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err: JsonWebTokenError | null, decoded: DecodedToken | undefined) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden', error: err.message });
    }

    if (decoded) {
      const { userid, email } = decoded;
      req.userid = userid; // Assurez-vous d'étendre le type Request pour inclure ces propriétés
      req.email = email;
    }

    next();
  });
};

export { verifyToken };
