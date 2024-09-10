// import { Request, Response, NextFunction } from 'express';
// import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();

// interface DecodedToken extends JwtPayload {
//   userid: string;
//   email: string;
// }

// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

// // Extend the Request interface to include decoded user information
// interface ExtendedRequest extends Request {
//   userid?: string; // Optional property to avoid potential errors
//   email?: string;
// }

// const verifyToken = (req: ExtendedRequest, res: Response, next: NextFunction): void => {
//   const accessToken = req.cookies.token || req.headers['x-access-token'] as string;

//   console.log('Access token:', accessToken);

//   if (!accessToken) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err: JsonWebTokenError | null, decoded: DecodedToken | undefined) => {
//     if (err) {
//       return res.status(403).json({ message: 'Forbidden', error: err.message });
//     }

//     if (decoded) {
//       req.userid = decoded.userid;
//       req.email = decoded.email;
//     }

//     next();
//   });
// };

// export { verifyToken };

// src/middlewares/verifyToken.ts

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

  console.log('Access token:', accessToken);

  if (!accessToken) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err: JsonWebTokenError | null, decoded: any) => {
    if (err) {
      res.status(403).json({ message: 'Forbidden', error: err.message });
      return;
    }

    if (decoded && typeof decoded === 'object') {
      req.userid = decoded.userid;
      req.email = decoded.email;
      req.user = decoded as DecodedToken;
    }

    next();
  });
};

