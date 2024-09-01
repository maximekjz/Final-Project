"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRefreshToken = exports.getUsersById = exports.getAllUsers = exports.getUserByEmail = exports.createUser = void 0;
const db_1 = require("../config/db"); // Assurez-vous que le chemin est correct
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = (userinfo) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email, first_name, last_name } = userinfo;
    try {
        console.log("User info:", userinfo);
        // Hash the password
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        console.log("Hashed password:", hashPassword);
        // Insert the user into the database
        const [user] = yield (0, db_1.db)("authusers").insert({ email, password: hashPassword, username, first_name, last_name }, ["email", "id"]);
        console.log("Inserted user:", user);
        return user;
    }
    catch (error) {
        console.error("Error during user creation:", error);
        throw error;
    }
});
exports.createUser = createUser;
const getUserByEmail = (email, username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, db_1.db)("authusers")
            .select("id", "email", "password")
            .where("email", email)
            .first();
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.getUserByEmail = getUserByEmail;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, db_1.db)("authusers");
        return users;
    }
    catch (error) {
        throw error;
    }
});
exports.getAllUsers = getAllUsers;
const getUsersById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [user] = yield (0, db_1.db)("authusers").where({ id });
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.getUsersById = getUsersById;
const updateRefreshToken = (refresh, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, db_1.db)("authusers")
            .update({ token: refresh })
            .where({ id });
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.updateRefreshToken = updateRefreshToken;
