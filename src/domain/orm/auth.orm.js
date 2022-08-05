// ORM (Object-relational mapping)

/**
 * ORM to connect user methods without authoritation
 */

import { userSchemas } from '../schemas/user.schema.js';
import { LogError } from '../../utils/logger.js';

import dotenv from 'dotenv';

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

dotenv.config();

const secret = process.env.SECRET

const userModel = userSchemas()

// CRUD (Create, Read, Update, Delete)

/**
 * Method to Register a new user in DB Collection
 * @param {*} user Object with name, lastname, email, password, categories and movements.
 * @returns error (if something wrong to create new user), message (if user already created) or promise from new user created.
 */
export const registerUser = async (user) => {
  try {
    let result;

    await userModel.findOne({email: user.email}).then((userFound) => {
      result = userFound;
    });
    
    if (result == null) {
      return await userModel.create(user);
    } else {
      return {
        message: 'The email already exists'
      }
    }
  } catch (error) {
    LogError(`[ORM ERROR]: Creating a new user ${error}`);
  }
}

/**
 * Method to User Login 
 * @param {*} auth Object with name && password.
 * @returns Error (if user not found in DB or password is wrong) or an Object with user's data and a JWT token.
 */
export const loginUser = async (auth) => {
  try {
    let userFound;
    let token;

    await userModel.findOne({email: auth.email}).then((user) => {
      userFound = user;
    }).catch((error) => {
      console.error('[ERROR Authentication in ORM]: User Not Found')
      throw new Error(`[ERROR Authentication in ORM]: User Not Found: ${error}`)
    });

    const validPassword = bcrypt.compareSync(auth.password, userFound.password);

    if (!validPassword) {
      console.error('[ERROR Authentication in ORM]: Password Not Valid')
      throw new Error('[ERROR Authentication in ORM]: Password Not Valid')
    };

    token = jwt.sign({ email: userFound.email }, secret, {
      expiresIn: '1d'
    });

    return {
      user: userFound,
      token
    }
  } catch (error) {
    LogError(`[ORM ERROR]: Login user ${error}`);
  }
}