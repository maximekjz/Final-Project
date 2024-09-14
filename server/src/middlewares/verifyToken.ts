import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface DecodedToken extends JwtPayload {
  userid: string;
  email: string;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

interface ExtendedRequest extends Request {
  userid?: string;
  email?: string;
  user?: DecodedToken;
}

export const verifyToken = (req: ExtendedRequest, res: Response, next: NextFunction): void => {
  const accessToken = req.cookies.token || req.headers['x-access-token'] as string;
  console.log('Cookies:', req.cookies);
  console.log('Headers:', req.headers);
  console.log('Access token:', accessToken);

  if (!accessToken) {
    console.log('No access token found in cookies or headers');
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err: JsonWebTokenError | null, decoded: any) => {
    if (err) {
      res.status(403).json({ message: 'Forbidden', error: err.message });
      return;
    }

      req.userid = decoded.userid;
      req.email = decoded.email;
    

    next();
  });
};

