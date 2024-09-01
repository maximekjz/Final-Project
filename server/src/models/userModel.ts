import { db } from '../config/db'; // Assurez-vous que le chemin est correct
import bcrypt from 'bcrypt';

interface UserInfo {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const createUser = async (userinfo: UserInfo) => {
  const { username, password, email, first_name, last_name } = userinfo;

  try {
    console.log("User info:", userinfo);

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashPassword);

    // Insert the user into the database
    const [user] = await db("authusers").insert(
      { email, password: hashPassword, username, first_name, last_name },
      ["email", "id"]
    );

    console.log("Inserted user:", user);

    return user;
  } catch (error) {
    console.error("Error during user creation:", error);
    throw error;
  }
};

export const getUserByEmail = async (email: string, username: string) => {
  try {
    const user = await db("authusers")
      .select("id", "email", "password")
      .where("email", email)
      .first();
    return user;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const users = await db("authusers");
    return users;
  } catch (error) {
    throw error;
  }
};

export const getUsersById = async (id: string) => {
  try {
    const [user] = await db("authusers").where({ id });
    return user;
  } catch (error) {
    throw error;
  }
};

export const updateRefreshToken = async (refresh: string, id: string) => {
  try {
    const user = await db("authusers")
      .update({ token: refresh })
      .where({ id });
    return user;
  } catch (error) {
    throw error;
  }
};
