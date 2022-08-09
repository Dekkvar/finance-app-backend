import { LogError, LogSuccess, LogWarning } from '../utils/logger.js';

// ORM - User Collection
import { getUserInfo, getUserData, updateUser, deleteUser, updateUserData, updateUserMovements, getUserLast12MonthsMovements } from '../domain/orm/user.orm.js';

export class UserController {
  /**
   * Controller to get personal user data.
   * @param {*} id of the user.
   * @returns Error (if the id dont match with any user in DB) or user data object (if successfully match in DB)
   */
  async getUserInfo(id) {
    let response;

    const data = await getUserInfo(id);

    if (!data) {
      LogWarning('[/api/user/me] Need to provide valid user to get any data')
      response = {
        error: 'Invalid User'
      }
    } else {
      LogSuccess('[/api/user/me] Data get successfully')
      response = data;
    }

    return response;
  }

  /**
   * Controller to Get Dashboard User Data.
   * @param {*} id of the user
   * @returns information for the dashboard (accounts, categories and movements)
   */
  async getUserData(id) {
    let response;

    const data = await getUserLast12MonthsMovements(id);
    console.log(data)

    if (!data) {
      LogWarning('[/api/user/me] Need to provide valid user to get any data')
      response = {
        error: 'Invalid User'
      }
    } else {
      LogSuccess('[/api/user/me] Data get successfully')
      response = data;
    }

    return response; 
  }
  
  /**
   * Controller to update personal User data.
   * @param {*} id of the user.
   * @param {*} data iformation to update.
   * @returns message with error or successfull
   */
  async updateUser(id, data) {
    let response;

    const query = await updateUser(id, data);

    if (!query) {
      LogWarning('[/api/user/me] Need to provide valid user to update any data')
      response = {
        error: 'Invalid User'
      }
    } else if (data.password) {
      LogSuccess('[/api/user/me] Password successfully updated')
      response = {
        message: 'Password, successfully updated'
      }
    } else {
      LogSuccess('[/api/user/me] User data successfully updated')
      response = query;
    }

    return response;
  }

  /**
   * Controller to update accounts or categories data.
   * @param {*} id of the user.
   * @param {*} data object for update accounts or categories.
   * @returns message with error or succesfull
   */
  async updateUserData(id, data) {
    let response;

    const query = await updateUserData(id, data);

    if (!query) {
      LogWarning('[/api/user/data] Need to provide valid user to update any data');
      response = {
        error: 'Error to update user data'
      }
    } else {
      LogSuccess(`[/api/user/data] Data ${Object.keys(data)[0]} successfully updated`);
      response = {
        message: `Data ${Object.keys(data)[0]} successfully updated`
      }
    } 

    return response;
  }

  /**
   * Controller to update User movements.
   * @param {*} id of the user.
   * @param {*} data object for update movements.
   * @returns message with error or successfull
   */
   async updateUserMovements(id, data) {
    let response;

    // Data for search
    const year = data.year;
    const month = data.month;

    // Data to update
    const income = data.income;
    const outcome = data.outcome;
    const movements = data.movements;

    const query = await updateUserMovements(id, year, month, income, outcome, movements);

    if (!query) {
      LogWarning('[/api/user/data] Need to provide valid user to update any movements');
      response = {
        error: 'Error to update user movements'
      }
    } else {
      LogSuccess(`[/api/user/data] Data movements from ${month} ${year} successfully updated`);
      response = {
        message: `Data movements from ${month} ${year} successfully updated`
      }
    } 

    return response;
  }

  /**
   * Controller to delete an User.
   * @param {*} id 
   * @returns 
   */
  async deleteUser(id) {
    let response;

    if (id) {
      LogSuccess(`[/api/user/me] Delete User By ID: ${id}`)
      await deleteUser(id).then((r) => {
        response = {
          message: `User with id ${id} deleted successfully`
        }
      })
    } else {
      LogWarning('[/api/user/me] Delete User Without ID')
      response = {
        message: 'Please, provide an ID to remove from database'
      }
    }

    return response;
  }
}