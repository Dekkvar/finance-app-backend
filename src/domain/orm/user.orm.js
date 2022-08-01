// ORM (Object-relational mapping)

import { userSchemas } from '../../domain/schemas/user.schema.js';
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
 */
export const registerUser = async (user) => {
  try {
    let result;

    await userModel.findOne({email: user.email}).then((userFound) => {
      result = userFound;
    });
    
    if (result == null) {
      return await userModel.create(user)
    } else {
      return {
        message: 'The email already exists'
      }
    }
  } catch (error) {
    LogError(`[ORM ERROR]: Creating a new user ${error}`)
  }
}


/**
 * Method to obtain all Users from Collection 'users' in Mongo server.
 */
export const getAllUsers = async (page, limit) => {
  try {
    let response = {};

    await userModel.find({ idDeleted: false })
      .select('name lastname email')
      .limit(limit)
      .skip((page-1) * limit)
      .exec().then((users) => {
        response.users = users;
      });

    await userModel.countDocuments().then((total) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response
  } catch (error) {
    LogError(`[ORM ERROR]: Getting All Users ${error}`);
  }
}