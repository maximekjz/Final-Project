import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { createUser, getUserByEmail, updateRefreshToken, getAllUsers as getAllUsersFromModel } from '../models/userModel'; // Notez le renommage de l'importation pour éviter les conflits

config(); 

interface User {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const registerUser = async (req: Request, res: Response) => {
  const { username, password, email, first_name, last_name }: User = req.body;

  const user: User = { username, password, email, first_name, last_name };

  try {
    const userInfo = await createUser(user);
    res.status(201).json({
      message: "User registered successfully",
      user: userInfo,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);

    if (error instanceof Error) {
      if (error.message.includes("duplicate key value")) {
        const field = error.message.includes("username") ? "Username" : "Email";
        res.status(409).json({ error: `${field} already exists` });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined in the environment variables");
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email, '');

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Authentication failed" });
      return;
    }

    const accessToken = jwt.sign(
      { userid: user.id, email: user.email },
      ACCESS_TOKEN_SECRET, // Utilisation de la clé secrète chargée
      { expiresIn: "3d" }
    );

    const refreshToken = jwt.sign(
      { userid: user.id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET as string, // On répète la même vérification pour le refresh token si besoin
      { expiresIn: "3d" }
    );

    res.cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000 * 24 * 3, // 3 days
    });

    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000 * 24 * 3, // 3 days
    });

    await updateRefreshToken(refreshToken, user.id);

    res.json({
      message: "Login successful",
      user: { userid: user.id, email: user.email },
      token: accessToken,
      refresh: refreshToken,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);

    if (error instanceof Error) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersFromModel(); // Utilisez le nom importé pour éviter les conflits
    res.json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);

    if (error instanceof Error) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
