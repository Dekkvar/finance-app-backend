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

export const updateUserMovements = async (id, year, mon, inc, out, mov) => {
  try {
    let oldMovements = await userModel.findById(id, '-_id movements');

    if (!oldMovements.movements.has(year.toString())) {
      let movementsToUpdate = oldMovements;
      let addNewYearMovements = {
        [mon]: {
          income: inc,
          outcome: out,
          movements: mov
        }
      }
      
      movementsToUpdate.movements.set(year.toString(), addNewYearMovements)

      return await userModel.findByIdAndUpdate(id, {$set: {movements: movementsToUpdate.movements}})
    } else {
      let yearToUpdate = oldMovements.movements.get(year.toString());
      let updatedMovements = oldMovements;
      let newMonth = {
        income: inc,
        outcome: out,
        movements: mov
      };

      yearToUpdate[mon] = newMonth;
        
      updatedMovements.movements.set(year.toString(), yearToUpdate)

      return await userModel.findByIdAndUpdate(id, {$set: {movements: updatedMovements.movements}})
    }
  } catch (error) {
    LogError(`[ORM ERROR] Updating User ${id} movements for ${mon} ${year}: ${error}`);
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