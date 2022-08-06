/**
 * ORM to connect methods that needs authoritation
 */

 import { userSchemas } from '../schemas/user.schema.js';
 import { LogError } from '../../utils/logger.js';
 
 const userModel = userSchemas()

// CRUD

/**
 * Method to Get Personal User Data
 * @param {*} id of user
 * @returns Error (if user not found in DB) or an Object with the user's data.
 */
export const getUserInfo = async (id) => {
  try {
    return await userModel.findById(id).select('-_id -password -accounts -categories -movements -__v')
  } catch (error) {
    LogError(`[ORM ERROR] Getting User Data: ${error}`);
  }
}

/**
 * Method to Get Dashboard User Data
 * @param {*} id of user
 * @returns Error (if user not found in DB) or an Object with the user's data.
 */
export const getUserData = async (id) => {
  try {
    return await userModel.findById(id).select('accounts categories movements -_id') // TODO: Only get last 12 months movements.
  } catch (error) {
    LogError(`[ORM ERROR] Getting User Data: ${error}`);
  }
}

/**
 * Method to Update User Info
 * @param {*} id of the user.
 * @param {*} data to update.
 * @returns Error (if user not found in DB) or an Object with the user's data.
 */
export const updateUser = async (id, data) => {
  try {
    return await userModel.findByIdAndUpdate(id, data, {new: true, select: '-_id -password -accounts -categories -movements -__v'});
  } catch (error) {
    LogError(`[ORM ERROR] Updating User ${id}: ${error}`);
  }
}

/**
 * Method to Update User Data
 * @param {*} id of the user.
 * @param {*} data to update.
 * @returns Error (if user not found in DB) or an Object with the user's data.
 */
 export const updateUserData = async (id, data) => {
  try {
    return await userModel.findByIdAndUpdate(id, data);
  } catch (error) {
    LogError(`[ORM ERROR] Updating User Data ${data[0]} ${id}: ${error}`);
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
    LogError(`[ORM ERROR] Deleting User by ID: ${error}`)
  }
}