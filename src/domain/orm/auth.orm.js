/**
 * ORM to connect methods that needs authoritation
 */

 import { userSchemas } from '../../domain/schemas/user.schema.js';
 import { LogError } from '../../utils/logger.js';
 
 const userModel = userSchemas()

// CRUD

/**
 * Method to Get User Data
 * @param {*} id of user
 * @returns Error (if user not found in DB) or an Object with the user's data.
 */
export const getUserData = async (id) => {
  try {
    return await userModel.findById(id).select('-_id name lastname email categories movements')
  } catch (error) {
    LogError(`[ORM ERROR]: Getting User Data ${error}`);
  }
}

/**
 * Method to Delete User
 * @param {*} id of user
 * @returns Error (if user not found in DB) or number of deleted users.
 */
export const deleteUser = async (id) => {
  try {
    return await userModel.deleteOne({ _id: id })
  } catch (error) {
    LogError(`[ORM ERROR]: Deleting User by ID: ${error}`)
  }
}