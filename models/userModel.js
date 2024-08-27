const { db } = require("../config/db.js");
const bcrypt = require("bcrypt");

module.exports = {
  createUser: async (userinfo) => {
    const { username, password, email, first_name, last_name } = userinfo;
    const trx = await db.transaction();
  
    try {
      console.log("User info:", userinfo);
  
      try {
        const hashPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hashPassword);
      } catch (error) {
        console.error("Error hashing password:", error);
        throw error; // Ou gérez l'erreur d'une autre manière
      }
  
      const [user] = await trx("authusers").insert(
        { email, password: hashPassword, username, first_name, last_name },
        ["email", "id"]
      );
  
      console.log("Inserted user:", user);
  
      await trx.commit();
      return user;
    } catch (error) {
      await trx.rollback();
      console.error("Error during transaction:", error);
      throw error;
    }
  },
  

  getUserByEmail: async (email = "", username = "") => {
    try {
      const user = await db("authusers")
        .select("id", "email", "password")
        .where("email", email)
        .first();
      return user;
    } catch (error) {
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const users = await db("authusers");
      return users;
    } catch (error) {
      throw error;
    }
  },

  getUsersById: async(id) => {
    try{
      const [user] = await db('authusers').where({id});
      return user;
    }
    catch (error){
      throw(error)
    }
  },

  updateRefreshToken: async(refresh, id) => {
    try{
      const user = await db('authusers')
      .update({token: refresh})
      .where({id})
    return user
    }catch (error){
      throw error
    }
  }
};
